import * as THREE from "three";

/**
 * Constructs a mesh from the given mesh data.
 * Used https://devforum.roblox.com/t/roblox-mesh-format/326114 as a reference.
 * @param {string} meshData The mesh data.
 * @returns {THREE.Mesh} The mesh constructed from the given mesh data.
 */
async function constructMesh(meshData) {
	var lines = meshData.split("\n");
	var geometry = new THREE.BufferGeometry();
	var pos = [];
	var norm = [];

	// for meshes using mesh format version 1.00
	if (meshData.startsWith("version 1.00")) {
		console.log("mesh format version 1.00");

		var faceNum = parseInt(lines[1]); // get the number of faces
		var data = lines[2].match(/\[(.*?)\]/gm); // split the data into an array of vectors ([x, y, z], [nx, ny, nz], [u, v, 0]) (as a string)
		for (let i = 0; i < data.length; i++) {
			let vector = data[i];
			// vector is in the format of [x, y, z] and is a string
			// convert it to a float array
			vector = vector
				.replace("[", "")
				.replace("]", "")
				.split(",")
				.map((x) => parseFloat(x));
			data[i] = vector;
		}
		console.log(data);

		for (let face = 0; face < faceNum; face++) {
			// for each face
			let index = face * 3; // get the index of the face's position vector
			let facePos = data[index]; // position
			let faceNorm = data[index + 1]; // normal
			pos.push(facePos[0], facePos[1], facePos[2]);
			norm.push(faceNorm[0], faceNorm[1], faceNorm[2]);
		}
	}

	geometry.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
	geometry.setAttribute("normal", new THREE.Float32BufferAttribute(norm, 3));

	return new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
}

export { constructMesh };

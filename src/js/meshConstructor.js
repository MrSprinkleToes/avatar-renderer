import * as THREE from "three";

/**
 * Constructs a mesh from the given mesh data.
 * Used https://devforum.roblox.com/t/roblox-mesh-format/326114 as a reference.
 * @param {string} meshData The mesh data.
 * @returns {THREE.Mesh} The mesh constructed from the given mesh data.
 */
async function constructMesh(meshData, tex) {
	var geometry = new THREE.BufferGeometry();
	var pos = [];
	var norm = [];
	var uv = [];
	var colors = []; // vertex colors, not used in version 1.XX meshes

	var meshDataString = new TextDecoder("utf-8").decode(meshData);
	var version = meshDataString.slice(0, 12);
	var material = new THREE.MeshBasicMaterial({
		map: tex,
		vertexColors: !version.startsWith("version 1."),
	});

	console.log(version);

	// for meshes using mesh format version 1.00
	if (version.startsWith("version 1.")) {
		var lines = meshDataString.split("\n");

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

		for (let i = 0; i < data.length; i += 3) {
			// for each face
			let facePos = data[i]; // position
			let faceNorm = data[i + 1]; // normal
			let faceUv = data[i + 2]; // uv

			if (version.startsWith("version 1.00")) {
				pos.push(facePos[0] * 0.5, facePos[1] * 0.5, facePos[2] * 0.5);
			} else {
				pos.push(facePos[0], facePos[1], facePos[2]);
			}
			norm.push(faceNorm[0], faceNorm[1], faceNorm[2]);
			uv.push(faceUv[0], faceUv[1]);
		}
	} else if (
		version.startsWith("version 2.") ||
		version.startsWith("version 3.") ||
		version.startsWith("version 4.")
	) {
		var data = new DataView(meshData);
		var headerStart = 13;
		var meshHeaderSize = data.getUint16(headerStart, true);
		var vertexSize = data.getUint8(headerStart + 2, true);
		var faceSize = data.getUint8(headerStart + 3, true);
		var vertCount = data.getUint32(headerStart + 4, true);
		var faceCount = data.getUint32(headerStart + 8, true);

		if (version.startsWith("version 4.")) {
			vertCount = data.getUint32(headerStart + 4, true);
			faceCount = data.getUint32(headerStart + 8, true);
			vertexSize = 40;
			faceSize = 12;
		} else if (meshHeaderSize > 12) {
			vertCount = data.getUint32(headerStart + 8, true);
			faceCount = data.getUint32(headerStart + 12, true);
		}

		var vertexStart = headerStart + meshHeaderSize;
		var vertexEnd = vertexStart + vertexSize * vertCount;

		var verticies = [];

		var i = vertexStart;
		while (i < vertexEnd) {
			var vertex = [
				data.getFloat32(i, true), // position x
				data.getFloat32(i + 4, true), // position y
				data.getFloat32(i + 8, true), // position z
				data.getFloat32(i + 12, true), // normal x
				data.getFloat32(i + 16, true), // normal y
				data.getFloat32(i + 20, true), // normal z
				data.getFloat32(i + 24, true), // uv u
				1 - data.getFloat32(i + 28, true), // uv v
				data.getFloat32(i + 32, true), // uv w
				255, // vertex color r
				255, // vertex color g
				255, // vertex color b
				255, // vertex color a
			];

			if (vertexSize >= 40) {
				vertex[9] = data.getUint8(i + 36, true); // vertex color r
				vertex[10] = data.getUint8(i + 37, true); // vertex color g
				vertex[11] = data.getUint8(i + 38, true); // vertex color b
				vertex[12] = data.getUint8(i + 39, true); // vertex color a
			}

			verticies.push(vertex);
			i += vertexSize;
		}

		var faceStart = vertexEnd;
		var faceEnd = faceStart + faceSize * faceCount;

		var faces = [];

		i = faceStart;
		while (i < faceEnd) {
			faces.push([
				data.getUint32(i, true), // vertex index 1
				data.getUint32(i + 4, true), // vertex index 2
				data.getUint32(i + 8, true), // vertex index 3
			]);
			i += faceSize;
		}

		for (let i = 0; i < faces.length; i++) {
			var face = faces[i];
			var v1 = verticies[face[0]];
			var v2 = verticies[face[1]];
			var v3 = verticies[face[2]];

			pos.push(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2], v3[0], v3[1], v3[2]);
			norm.push(v1[3], v1[4], v1[5], v2[3], v2[4], v2[5], v3[3], v3[4], v3[5]);
			uv.push(v1[6], v1[7], v2[6], v2[7], v3[6], v3[7]);
			colors.push(
				v1[9] / 255,
				v1[10] / 255,
				v1[11] / 255,
				v1[12] / 255,
				v2[9] / 255,
				v2[10] / 255,
				v2[11] / 255,
				v2[12] / 255,
				v3[9] / 255,
				v3[10] / 255,
				v3[11] / 255,
				v3[12] / 255
			);
		}
	}

	geometry.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
	geometry.setAttribute("normal", new THREE.Float32BufferAttribute(norm, 3));
	geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
	if (!version.startsWith("version 1.")) {
		geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 4));
	}

	return new THREE.Mesh(geometry, material);
}

export { constructMesh };

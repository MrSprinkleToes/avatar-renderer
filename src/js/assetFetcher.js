import { parseString } from "xml2js";

/**
 * Fetches the mesh and texture IDs of an accessory.
 * Used https://codepen.io/foxt/pen/xxObQPO?editors=0011 as a reference.
 * @param {number} id The accessory's ID.
 * @returns {string, string} meshId, texId
 */
async function fetchAccessoryAssetIds(id) {
	var meshId;
	var texId;

	var assetData = await fetch(
		`http://localhost:8081/https://assetdelivery.roblox.com/v1/asset?id=${id}`
	).then((response) => response.text());

	var xml = parseString(assetData);
	if (xml === undefined) {
		// fetching mesh

		var meshIdSplit = assetData.split("MeshId");
		if (meshIdSplit.length < 2) {
			console.error("No MeshId found.");
			return;
		}

		var idSplit = meshIdSplit[1].split("PROP");
		meshId = idSplit[0]
			.substring(5, 9999)
			.replace("http://www.roblox.com/asset/?id=", "")
			.replace("http://www.roblox.com/asset?id=", "")
			.replace("rbxassetid://", "");

		// ---------------------------------------------
		// fetching texture

		var texIdSplit = assetData.split("TextureId");
		if (texIdSplit.length < 2) {
			console.error("No TextureId found.");
		} else {
			var idSplit = texIdSplit[1].split("PROP");
			texId = idSplit[0]
				.substring(5, 9999)
				.replace("http://www.roblox.com/asset/?id=", "")
				.replace("http://www.roblox.com/asset?id=", "")
				.replace("rbxassetid://", "");
		}
	} else {
		// fetching mesh

		var meshIdSplit = assetData.split(`<Content name="MeshId"><url>`);
		if (meshIdSplit.length < 2) {
			console.error("No MeshId found.");
			return;
		}
		var idSplit = meshIdSplit[1].split("</url>");
		var meshId = idSplit[0]
			.replace("http://www.roblox.com/asset/?id=", "")
			.replace("http://www.roblox.com/asset?id=", "")
			.replace("rbxassetid://", "");
		console.log(meshId);

		// ---------------------------------------------
		// fetching texture

		var texIdSplit = assetData.split('<Content name="TextureId"><url>');
		if (texIdSplit.length < 2) {
			console.error("No TextureId found.");
		} else {
			var idSplit = texIdSplit[1].split("</url>");
			texId = idSplit[0]
				.replace("http://www.roblox.com/asset/?id=", "")
				.replace("http://www.roblox.com/asset?id=", "")
				.replace("rbxassetid://", "");
		}
	}

	return { meshId, texId };
}

/**
 * Fetches the data of a mesh.
 * @param {number} id MeshId
 * @returns mesh data
 */
async function fetchMeshData(id) {
	var meshDataSourceInfo = await fetch(
		`http://localhost:8081/https://assetdelivery.roblox.com/v2/asset?id=${id}`
	).then((response) => response.json());
	var meshDataLocation = meshDataSourceInfo.locations[0].location;

	var meshData = await fetch(meshDataLocation).then((response) =>
		response.arrayBuffer()
	);

	return meshData;
}

async function fetchTextureData(id) {
	var textureDataSourceInfo = await fetch(
		`http://localhost:8081/https://assetdelivery.roblox.com/v2/asset?id=${id}`
	).then((response) => response.json());
	var textureDataLocation = textureDataSourceInfo.locations[0].location;

	var textureData = await fetch(textureDataLocation).then((response) =>
		response.blob()
	);

	return textureData;
}

export { fetchAccessoryAssetIds, fetchMeshData, fetchTextureData };

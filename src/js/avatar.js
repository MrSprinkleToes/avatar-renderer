import { parseString } from "xml2js";
import { fetchAccessoryAssetIds, fetchMeshData } from "./assetFetcher";
import { constructMesh } from "./meshConstructor";

/**
 * Renders the avatar of the given user id.
 * @param {number} userId The user id used to fetch the avatar information.
 */
async function renderAvatar(userId, scene) {
	const avatarInfo = await fetch(
		`http://localhost:8081/https://avatar.roblox.com/v1/users/${userId}/avatar`
	).then((response) => response.json());
	const { meshId, texId } = await fetchAccessoryAssetIds(607700713);

	const meshData = await fetchMeshData(meshId);
	const mesh = await constructMesh(meshData);

	scene.add(mesh);
}

export { renderAvatar };

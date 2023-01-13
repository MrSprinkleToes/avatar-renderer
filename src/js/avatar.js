import {
	fetchAccessoryAssetIds,
	fetchMeshData,
	fetchTextureData,
} from "./assetFetcher";
import { constructMesh } from "./meshConstructor";
import { TextureLoader } from "three";

const texLoader = new TextureLoader();

const hats = [
	48474294, 607700713, 607702162, 4819740796, 48474313, 121390915, 5634362258,
	9787169126,
];

async function renderAccessory(id, scene, i) {
	let { meshId, texId } = await fetchAccessoryAssetIds(id);
	let meshData = await fetchMeshData(meshId);
	let texBlob = await fetchTextureData(texId);
	let tex = texLoader.load(URL.createObjectURL(texBlob));
	let mesh = await constructMesh(meshData, tex);

	mesh.position.set(i * 4, 0, 0);
	scene.add(mesh);

	return mesh;
}

/**
 * Renders the avatar of the given user id.
 * @param {number} userId The user id used to fetch the avatar information.
 */
async function renderAvatar(userId, scene) {
	const avatarInfo = await fetch(
		`http://localhost:8081/https://avatar.roblox.com/v1/users/${userId}/avatar`
	).then((response) => response.json());

	var accessoryPromises = [];
	for (let i = 0; i < hats.length; i++) {
		accessoryPromises.push(renderAccessory(hats[i], scene, i));
	}

	var meshes = await Promise.all(accessoryPromises);
	console.log(meshes);
}

export { renderAvatar };

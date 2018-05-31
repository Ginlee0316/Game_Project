#pragma strict

@script ExecuteInEditMode()

enum tenCamToolType{sky,particles,none};
var cameraType : tenCamToolType;
var renderTexDiff : RenderTexture;
var skyMaterial : Material;
var envTex : Texture;

private var tenkokuModuleObject : TenkokuModule;
private var surfaceRenderer : Renderer;
private var cam : Camera;
private var copyCam : Camera;
private var camMatrix : Matrix4x4;

private var updateTimer : float = 0.0;
private var currResolution : int = 256;
private var doUpdate : boolean = false;



function Start () {

	if (Application.isPlaying){

		tenkokuModuleObject = GameObject.Find("Tenkoku DynamicSky").gameObject.GetComponent(TenkokuModule);
		cam = gameObject.GetComponent(Camera) as Camera;
		if (tenkokuModuleObject != null){
			copyCam = tenkokuModuleObject.mainCamera.GetComponent(Camera);
		}
	}

	RenderSettings.skybox = skyMaterial;
}



function Update () {

	if (!Application.isPlaying){
		RenderSettings.skybox = skyMaterial;
	}
}




function LateUpdate () {

	if (Application.isPlaying){
		if (envTex != null) Shader.SetGlobalTexture("_Tenkoku_EnvironmentCube",envTex);

		if (skyMaterial != null){
			if (RenderSettings.skybox == null){
				RenderSettings.skybox = skyMaterial;
			}
		}


		//if (copyCam == null){
		//	if (tenkokuModuleObject != null){
		//		if (tenkokuModuleObject.mainCamera != null){
		//			copyCam = tenkokuModuleObject.mainCamera.GetComponent(Camera);
		//		} else {
		//			Debug.Log("TENKOKU ERROR: Main camera object has not been defined!  Please set the Main Camera under the Configuration tab.");
		//		}
		//	}
		//} else {


		//update camera tracking when necessary
		if (tenkokuModuleObject.mainCamera != null){
			copyCam = tenkokuModuleObject.mainCamera.GetComponent(Camera);
			CameraUpdate();
		}

		


		//}
	}

}




function CameraUpdate () {

	if (copyCam != null && cam != null){

		//set camera settings
		cam.enabled = true;
		cam.transform.position = copyCam.transform.position;
		cam.transform.rotation = copyCam.transform.rotation;
		cam.projectionMatrix = copyCam.projectionMatrix;
		cam.fieldOfView = copyCam.fieldOfView;
		cam.renderingPath = copyCam.actualRenderingPath;
		cam.farClipPlane = copyCam.farClipPlane;


		if (renderTexDiff != null){

			//pass texture to shader
			if (surfaceRenderer != null){
				if (cameraType == tenCamToolType.sky){
					surfaceRenderer.material.SetTexture("_testTransTex",renderTexDiff);
				}
			}

			if (cameraType == tenCamToolType.particles){
				Shader.SetGlobalTexture("_Tenkoku_ParticleTex",renderTexDiff);
			}

		}
	}

}

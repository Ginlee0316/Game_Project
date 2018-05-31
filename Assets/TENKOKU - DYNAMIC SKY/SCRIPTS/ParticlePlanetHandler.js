#pragma strict

import System.IO;

//PUBLIC VARIABLES

var planetReset : boolean = false;
var planetName : String = "mars";
var planetVis : float = 1.0;
var planetColor : Color = Color(1.0,1.0,1.0,1.0);
var planetSize : float = 0.02;
var planetOffset : Vector3 = Vector3(0,0,0);

//PRIVATE VARIABLES
private var numParticles : int = 1;
private var hasStarted : boolean = false;
private var PlanetSystem : ParticleSystem;
private var planetRenderer : Renderer;
private var PlanetParticles : ParticleSystem.Particle[];
private var planetPOS : Vector4[];
private var planetDataArray : String[];
private var planetDataString : String;
private var currPlanetVis : float = -1.0;

private var px : int = 0;
private var useColor : Color = Color(0,0,0,0);
private var visColor : Color = Color(0.5,0.5,0.5,1);



function Start () {

	hasStarted = false;
	PlanetSystem = this.GetComponent(ParticleSystem);
	PlanetSystem.Emit(numParticles);

	planetRenderer = this.GetComponent(Renderer);
	PlanetParticles = new ParticleSystem.Particle[8];
	//InvokeRepeating("PlSystemUpdate",0.0,0.01);

}



function LateUpdate(){

	if (currPlanetVis != planetVis){
		currPlanetVis = planetVis;
		//planetReset = true;

		if (planetRenderer != null){
			visColor = planetRenderer.material.GetColor("_TintColor");
			visColor.a = planetVis;
			planetRenderer.material.SetColor("_TintColor", visColor);
		}
	}
	
	if (!hasStarted){
		hasStarted = true;
		planetReset = true;
	}

	if (planetReset){
		PlSystemUpdate();
	}
}




function PlSystemUpdate () {

	//reset planet system
	if (planetReset){

	planetReset = false;
	//PlanetParticles = new ParticleSystem.Particle[8];
	PlanetSystem.GetParticles(PlanetParticles);
	
	for (px = 0; px < 8; px++){

			//default position
			if (px < PlanetSystem.particleCount && PlanetParticles[px] != null){
				PlanetParticles[px].position = Vector3(-25,0,0);
				PlanetParticles[px].position.x += planetOffset.x;
				PlanetParticles[px].position.y += planetOffset.y;
				PlanetParticles[px].position.z += planetOffset.z;
				
				// set planet size
				#if UNITY_5_3 || UNITY_5_4 || UNITY_5_6 || UNITY_5_7 || UNITY_5_8 || UNITY_5_9
					PlanetParticles[px].startSize = planetSize;
				#else
					PlanetParticles[px].size = planetSize;
				#endif

				// set planet color
				useColor = planetColor;
				//useColor.a *= planetVis;

				#if UNITY_5_3 || UNITY_5_4 || UNITY_5_6 || UNITY_5_7 || UNITY_5_8 || UNITY_5_9
					PlanetParticles[px].startColor = useColor;
				#else
					PlanetParticles[px].color = useColor;
				#endif

			} else {
				break;
			}

			px++;
		}

		PlanetSystem.SetParticles(PlanetParticles,PlanetParticles.length);
		PlanetSystem.Emit(PlanetParticles.length);
		PlanetSystem.Play();

	}
}







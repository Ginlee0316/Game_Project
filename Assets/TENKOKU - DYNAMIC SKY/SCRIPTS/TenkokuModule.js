#pragma strict

@script ExecuteInEditMode()



//PUBLIC VARIABLES
var tenkokuVersionNumber : String = "";
var mainCamera : Transform;
var manualCamera : Transform;
var cameraTypeIndex : int = 0;
var cameraTypeOptions = new Array("Auto Select Camera","Manual Select Camera");

var lightLayer : int = 2;
var lightLayerMask : LayerMask;
var tenLayerMasks : Array;

var colorOverlay : Color = Color(1,1,1,1);
var colorSky : Color = Color(1,1,1,0);
var colorAmbient : Color = Color(0,0,0,0.6);

var useSunRays : boolean = true;
var sunRayIntensity : float = 1.0;
var moonRayIntensity : float = 1.0;
var useAmbient : boolean = true;
var _isForward : boolean = false;

var enableIBL : boolean = false;
var enableFog : boolean = false;
//var overrideFog : boolean = true;

var showConfig : boolean = false;
var showCelSet : boolean = false;
var showTimer : boolean = true;
var showSounds : boolean = false;

var showConfigTime : boolean = false;
var showConfigAtmos : boolean = false;
var showConfigWeather : boolean = false;

var showIBL : boolean = false;

var cloudRotSpeed : float = 0.2;
var cloudOverRot : float = 0.0;
var cloudSz : float = 1.0;
var cloudSc : float = 1.0;
var skyBrightness : float = 1.0;
var useSkyBright : float = 1.0;
var nightBrightness : float = 0.4;
var fogDistance : float = 0.0015;
var fogAtmosphere : float = 0.2;

var setRotation : float = 180.0;
			
var useLatitude : float = 0.0;
var setLatitude : float = 0.0;
var setLongitude : float = 0.0;

var sunIsVisible : boolean = true;
var sunSize : float = 0.02;
var sunBright : float = 1.0;

var moonIsVisible : boolean = true;
var moonSize : float = 0.02;
var moonPos : float = 0.0;
var moonBright : float = 1.0;

var auroraIsVisible : boolean = true;
var auroraSize : float = 1.4;
var auroraLatitude : float = 1.0;
var auroraIntensity : float = 1.0;
var auroraSpeed : float = 0.5;

var planetIntensity : float = 1.0;
var starIsVisible : boolean = true;

var ambientShift : float = 0.0;
var moonLightIntensity : float = 0.25;
var moonDayIntensity : float = 0.2;
var starIntensity : float = 1.0;
var galaxyIntensity : float = 1.0;


var horizonHeight = 0.5;
var horizonScale = 45.0;

var ambHorizonHeight = 1.0;
var ambHorizonScale = 30.0;

var lowHorizonHeight = 0.5;
var lowHorizonScale = 1.0;

var colorRamp : Texture2D;


var globalSoundFile : AudioClip[];
var globalSoundVolDay : Vector4[];
var globalSoundVolYear : Vector4[];

var cloudPlaneObject : GameObject;

var weatherTypeIndex : int = 0;
var weatherTypeOptions = new Array("Manual","Automatic (Random)","Automatic (Advanced)");

var sunTypeIndex : int = 0;
var sunTypeOptions = new Array("Realistic","Custom","Off");

var moonTypeIndex : int = 0;
var moonTypeOptions = new Array("Realistic","Custom","Off");

var starTypeIndex : int = 0;
var starTypeOptions = new Array("Realistic","Custom","Off");

var galaxyTypeIndex : int = 0;
var galaxyTypeOptions = new Array("Realistic","Custom","Off");

var auroraTypeIndex : int = 0;
var auroraTypeOptions = new Array("On","Off");

var galaxyTexIndex : int = 0;
var galaxyTexOptions = new Array("2D Spheremap","Cubemap");
var galaxyTex : Texture;
var galaxyCubeTex : Texture;

public var useCamera : Transform;
private var useCameraCam : Camera;
private var saveCamera : Transform;
private var setSkySize : float = 20.0;
private var setSkyUseSize : float = 1.0;
private var worldlightObject : GameObject;
private var tenkokuWindObject : WindZone;

var sunlightObject : GameObject;
public var sunSphereObject : GameObject;
private var sunObject : GameObject;
private var moonSphereObject : GameObject;
private var moonObject : GameObject;
var moonlightObject : Transform;
private var skyObject : GameObject;
private var ambientObject : GameObject;

private var starfieldObject : GameObject;
private var starGalaxyObject : GameObject;

private var mesh : Mesh;
private var vertices : Vector3[];
private var colors : Color[];
private var meshAmb : Mesh;
private var verticesAmb : Vector3[];
private var colorsAmb : Color[];

private var verticesLow : Vector3[];
private var colorsLow : Color[];

private var ambientSoundObject : TenkokuGlobalSound;

//private var sunFlare : LensFlare;

var ambientCol : Color = Color(0.5,0.5,0.5,1.0);
var colorSun : Color = Color(1,1,1,1);
var colorMoon : Color = Color(1,1,1,1);
var colorSkyBase : Color = Color(1,1,1,1);
var colorSkyBaseLow : Color = Color(1,1,1,1);
var colorHorizon : Color = Color(1,1,1,1);
var colorHorizonLow : Color = Color(1,1,1,1);
var colorSkyAmbient : Color = Color(1,1,1,1);
var colorClouds : Color = Color(1,1,1,1);
var colorHighlightClouds : Color = Color(1,1,1,1);
var colorSkyboxGround : Color = Color(0,0,0,1);

var stepTime : float;
var timeLerp : float = 0.0;

var calcTimeM : float = 0.0;
var setTimeM : float = 0.0;
var stepTimeM : float = 0.0;
var timeLerpM : float = 0.0;


//TIMER VARIABLES
var displayTime : String = "";

var autoTimeSync : boolean = false;
var autoDateSync : boolean = false;
var autoTime : boolean = false;
var useAutoTime : boolean = false;
var timeCompression : float = 100.0;
var useTimeCompression : float = 100.0;
var use24Clock : boolean = false;
var timeCurves : AnimationCurve;

var currentSecond : int = 0;

var currentMinute : int = 45;
var currentHour : int = 5;
var setHour : int = 5;
var currentDay : int = 22;
var currentMonth : int = 3;
var currentYear : int = 2013;

var useSecond : float = 0;
var useMinute : float = 0;
var displayHour : float = 0;
var useHour : float = 0;
var useDay : float = 0;
var useMonth : float = 0;
var useYear : float = 0;

var hourMode : String = "";
	
var moonSecond : int = 0;
var moonMinute : int = 0;
var moonHour : int = 0;
var moonDay : int = 0;
var moonMonth : int = 0;
var moonYear : int = 0;

var moonPhase : float = 180.0;

var starSecond : int = 0;
var starMinute : int = 0;
var starHour : int = 0;
var starDay : int = 0;
var starMonth : int = 0;
var starYear : int = 0;


var leapYear : boolean = false;
var monthFac : int = 31;

var moonTime : Vector3;

var setDay : float = 22000.0;
var setStar : float = 22000.0;
var setMoon : float = 22000.0;
var setMonth : float = 22000.0;
var setYear : float = 22000.0;

var dayValue : float = 0.5;
var starValue : float = 0.5;
var moonValue : float = 0.0;
var monthValue : float = 0.0;
var yearValue : float = 0.0;

var countSecond : float =  0.0;
var countMinute : float =  0.0;

var countSecondStar : float =  0.0;
var countMinuteStar : float =  0.0;

var countSecondMoon : float =  0.0;
var countMinuteMoon : float =  0.0;

var cloudLinkToTime : boolean = false;


private var nightSkyLightObject : Transform;
private var MV : Matrix4x4;

var starPos : float = 0.0;

var galaxyPos : float = 0.0;

//Weather Variables
var currentWeatherTypeIndex = -1;
var weather_forceUpdate : boolean = false;

var weather_setAuto : boolean = false;
var weather_qualityCloud : float = 0.7;
var weather_cloudAltAmt : float = 1.0;

var weather_cloudAltoStratusAmt : float = 0.0;
var weather_cloudCirrusAmt : float = 0.0;

var weather_cloudCumulusAmt : float = 0.2;
var weather_cloudScale : float = 0.5;
var weather_cloudSpeed : float = 0.0;

var weather_OvercastAmt : float = 0.0;
var weather_RainAmt : float = 0.0;
var weather_SnowAmt : float = 0.0;
var weather_WindAmt : float = 0.0;
var weather_WindDir : float = 0.0;
var weather_FogAmt : float = 0.0;
var weather_FogHeight : float = 0.0;

var weather_autoForecastTime : float = 5.0;
var weather_PatternTime : float = 0.0;
var weather_TransitionTime : float = 1.0;

var weather_temperature : float = 75.0;

// auto weather variables
private var w_isCloudy : float;
private var w_isOvercast : float;
private var w_cloudAmts : Vector4;
private var w_cloudTgts : Vector4;
private var w_cloudAmtCumulus : float;
private var w_cloudTgtCumulus : float;
private var w_overcastAmt : float;
private var w_overcastTgt : float;
private var w_windCAmt : float;		
private var w_windDir : float;
private var w_windAmt : float;
private var w_windCTgt : float;
private var w_windDirTgt : float;
private var w_windTgt : float;
private var w_rainAmt : float;
private var w_rainTgt : float;
private var w_snowAmt : float;
private var w_snowTgt : float;

private var calcComponent : TenkokuCalculations;
private var weather_WindCoords : Vector2 = Vector2(0,0);
private var currCoords : Vector2 = Vector2(0,0);
private var rainSystem : ParticleSystem;
private var rainFogSystem : ParticleSystem;
private var rainSplashSystem : ParticleSystem;
private var snowSystem : ParticleSystem;
private var fogSystem : ParticleSystem;

private var planetObjMercury : ParticlePlanetHandler;
private var planetObjVenus : ParticlePlanetHandler;
private var planetObjMars : ParticlePlanetHandler;
private var planetObjJupiter : ParticlePlanetHandler;
private var planetObjSaturn : ParticlePlanetHandler;
private var planetObjUranus : ParticlePlanetHandler;
private var planetObjNeptune : ParticlePlanetHandler;
private var planetRendererSaturn : Renderer;
private var planetRendererJupiter : Renderer;
private var planetRendererNeptune : Renderer;
private var planetRendererUranus : Renderer;
private var planetRendererMercury : Renderer;
private var planetRendererVenus : Renderer;
private var planetRendererMars : Renderer;


private var lightObjectNight : Light;
private var lightObjectWorld : Light;

private var renderObjectMoon : Renderer;
private var renderObjectGalaxy : Renderer;

private var renderObjectRain : Renderer;
private var renderObjectRainSplash : Renderer;
private var renderObjectRainFog : Renderer;
private var renderObjectFog : Renderer;
private var renderObjectSnow : Renderer;


private var renderObjectCloudPlane : Renderer;
private var renderObjectCloudSphere : Renderer;
private var renderObjectAurora : Renderer;

private var particleObjectRainFog : ParticleSystem;
private var particleObjectRainSplash : ParticleSystem;
private var particleObjectFog : ParticleSystem;


//collect for GC
private var setTime : float;
private var calcTime : float;
private var yAmt : float;
private var setEcliptic : float;
private var currClipDistance : float = 0.0;
private var iblActive : float = 0.0;
private var isLin : float = 0.0;
private var setTenkoku : float = 0.0;
private var currIblActive : float = -1.0;
private var currIsLin : float = -1.0;
private var currSetTenkoku : float = -1.0;
private var doWeatherUpdate : boolean = false;
private var chanceOfRain : float = -1.0;

private var moonApoSize : float = -1.0;
private var moonInt : float = -1.0;
private var moonWorlIntensity : float = -1.0;
private var mDCol : Color = Color(0,0,0,0);
private var setMCol : float = -1.0;
private var solarSetInten : float = -1.0;
private var ecldiff : float = -1.0;
private var eclAnnular : float = -1.0;
private var tempTrans : Transform;
private var useVec : Vector3 = Vector3(0,0,0);
private var useMult : float = -1.0;
private var pVisFac : float = -1.0;
private var starAngle : float = -1.0;
private var starTarget : Quaternion;
private var aquarialStart : int = 0;
private var precRate : float = -1.0;
private var precNudge : float = -1.0;
private var precFactor : float = -1.0;
private var eclipticStarAngle : float = -1.0; 
private var useGalaxyIntensity : float = -1.0; 
private var galaxyColor = Color(0,0,0,0);
private var galaxyVis = -1.0;
private var ambientCloudCol : Color = Color(0,0,0,0);
private var setSkyAmbient : Color = Color(0,0,0,0);
private var useAlpha : Color = Color(0,0,0,0);
private var setAmbCol : Color = Color(0,0,0,0);
private var setAmbientColor : Color = Color(0,0,0,0);
private var mixColor : Color = Color(0,0,0,0);
private var medCol : Color = Color(0,0,0,0);
private var useAmbientColor : Color = Color(0,0,0,0);
private var useOvercast : float = -1.0;
private var sL : float = -1.0;
private var fxUseLight : float = -1.0;
private var lDiff : float = -1.0;
private var rainCol : Color = Color(0,0,0,0);
private var splashCol : Color = Color(0,0,0,0);
private var rainfogCol : Color = Color(0,0,0,0);
private var rainfogFac : float = -1.0;	
private var fogCol : Color = Color(0,0,0,0);
private var fogFac : float = -1.0;	
private var snowCol : Color = Color(0,0,0,0);
private var timerCloudMod : float = -1.0;
private var cloudSpd : float = -1.0;
private var setCloudFog1 : Color = Color(0,0,0,0);
private var setCloudTint : Color = Color(0,0,0,0);
private var setCloudBase : Color = Color(0,0,0,0);
private var setOverallCol : Color = Color(0,0,0,0);
private var bgSCol : Color = Color(0,0,0,0);

private var altAdjust : float = -1.0;
private var fogDist : float = -1.0;
private var fogFull : float = -1.0;
private var skyAmbientCol : Color = Color(0,0,0,0);
private var skyHorizonCol : Color = Color(0,0,0,0);
private var ambientGI : Color = Color(0,0,0,0);
private var aurSpan : float = -1.0;
private var aurAmt : float = -1.0;
private var aurPos : float = -1.0;
private var setTimeSpan : float = -1.0;
private var curveVal : float = -1.0;
private var setString : String = "format";
private var eon : String = "";
private var monthLength : int = -1;
private var testMonth : int = -1;
private var monthAddition : float = 0.0;
private var aM : float = 1.0;
private var yearDiv : float = 365.0;
private var clampRes : float = 0.0;
private var px : int = 0;
private var hit : RaycastHit;
private var usePoint : float = 0.0;
private var setParticles : ParticleSystem.Particle[];
private var dir : Vector2 = Vector3(0,0);
private var tempAngle : Vector3 = Vector3(0,0,0);
private var texPos : int = 0;
private var returnColor : Color = Color(0,0,0,0);
private var eclipticAngle : float;
private var eclipticoffset : float;

private var sunAngle : float = -1.0;
private var sSDiv : float = -1.0;
private var sunCalcSize : float = -1.0;
private var moonAngle : float = -1.0;
private var moonClipAngle : float = -1.0;
private var moonPhac : float = 5.0;
private var moonCalcSize : float;

private var currColorSun : Color = Color(0,0,0,0);
var atmosphereDensity : float;

var fogDisperse : float = 25.0;
var fogDensity : float = 0.55;

var enableProbe : boolean = true;
private var tenkokuReflectionObject : ReflectionProbe;
private var reflectionTimer : float = 0.0;
var reflectionProbeFPS : float = 1.0;



//sound variables
var enableSoundFX : boolean = true;
var overallVolume : float = 1.0;
var audioWind : AudioClip;
var audioRain : AudioClip;
var audioTurb1 : AudioClip;
var audioTurb2 : AudioClip;
var audioAmbDay : AudioClip;
var audioAmbNight : AudioClip;
var volumeWind : float = 1.0;
var volumeRain : float = 1.0;
var volumeTurb1 : float = 1.0;
var volumeTurb2 : float = 1.0;
var volumeAmbDay : float = 1.0;
var volumeAmbNight : float = 1.0;

var curveAmbDay24 : AnimationCurve;
var curveAmbDayYR : AnimationCurve;
var curveAmbNight24 : AnimationCurve;
var curveAmbNightYR : AnimationCurve;


private var TenRandom : Random;
var sysTime : System.DateTime;



//Transition variables
var transitionTime : float = 0.0;
var compressionTime : float = 0.0;
var doTransition : boolean = false;
var transitionStartTime : String = "";
var transitionTargetTime : String;
var transitionTargetDate : String;
var transitionDuration : float = 5.0;
var transitionDirection : float = 1.0;
var transitionEase : boolean = true;
var transitionEaseTime : float = 1.0;
var transitionCallback : boolean = false;
var transitionCallbackObject : GameObject;
private var setTransHour : int;
private var setTransMinute : int;
private var setTransSecond : int;
private var startSecond : float;
private var startMinute : float;
private var startHour : float;
private var timeVal : float;
private var setTransVal : float;
private var endTime : int = 0;
private var startTime : int = 0;
private var currTime : int = 0;
private var transSameDay : boolean = true;
private var endTransition : boolean = false;

private var fogVals : String;
private var fogCameraCam : Camera;
private var fogCameraBlur : TenkokuSkyBlur;
private var setSun : String;
private var lightVals : String;

private var i : int;
private var layerName : String;
private var sunPos : Vector3;
private var sunColor : Color = colorSun * (ambientCol.r);
private var moonFaceCol : Color;
private var cloudSpeeds : Color;
private var overcastCol : Color;
private var WorldCol : Color;


private var dataString : String;
private var dataArray : String[];
private var pos1 : int;
private var pos2 : int;
private var length : int;
private var func : String;
private var dat : String;
private var xP : int = 0;
private var ax : int = 0;
private var dataUpdate : String;
private var data : String[];
private var setUpdate : String;
private var values : String[];
private var callbackObject : GameObject;


//Variables for Unity 5.3+ only
#if UNITY_5_3 || UNITY_5_4 || UNITY_5_6 || UNITY_5_7 || UNITY_5_8 || UNITY_5_9
	private var rainEmission : ParticleSystem.EmissionModule;
	private var rainFogEmission : ParticleSystem.EmissionModule;
	private var splashEmission : ParticleSystem.EmissionModule;
	private var fogEmission : ParticleSystem.EmissionModule;
	private var snowEmission : ParticleSystem.EmissionModule;

	private var rainForces : ParticleSystem.ForceOverLifetimeModule;
	private var rainFogForces : ParticleSystem.ForceOverLifetimeModule;
	private var fogForces : ParticleSystem.ForceOverLifetimeModule;
	private var snowForces : ParticleSystem.ForceOverLifetimeModule;
#endif




//flag variables
var currWeather_OvercastAmt : float = -1.0;


function Awake(){
	//GET CAMERA OBJECT
	if (Application.isPlaying){
		if (mainCamera == null){
			mainCamera = Camera.main.transform;
		}
	}
}


function Start () {

	//disconnect object from prefab connection
	#if UNITY_EDITOR
		PrefabUtility.DisconnectPrefabInstance(this.gameObject);
	#endif


	//set custom random generator
	TenRandom = new Random();

	//turn off Antialiasing in forward mode
	if (mainCamera != null){
		if (mainCamera.gameObject.GetComponent(Camera).renderingPath == RenderingPath.Forward){
        	QualitySettings.antiAliasing = 0;
    	}
    }


	//get objects at start
	LoadObjects();

}




function LoadObjects() {
	
	//GET TENKOKU OBJECTS
	calcComponent = this.gameObject.GetComponent(TenkokuCalculations) as TenkokuCalculations;
	
	//GET WINDZONE OBJECT
	tenkokuWindObject = GameObject.Find("Tenkoku_WindZone").GetComponent(WindZone);


	//GET REFLECTION PROBE
	if (GameObject.Find("Tenkoku_ReflectionProbe") != null){
		tenkokuReflectionObject = GameObject.Find("Tenkoku_ReflectionProbe").GetComponent(ReflectionProbe);
		if (tenkokuReflectionObject != null) tenkokuReflectionObject.RenderProbe(null);
	}


	//GET CELESTIAL OBJECTS
	worldlightObject = GameObject.Find("LIGHT_World");
	cloudPlaneObject = GameObject.Find("fxCloudPlane").gameObject;
	sunlightObject = GameObject.Find("LIGHT_Sun");
	sunSphereObject = GameObject.Find("SkySphereSun");
	sunObject = GameObject.Find("Sun");
	moonSphereObject = GameObject.Find("SkySphereMoon");
	moonObject = GameObject.Find("Moon");
	moonlightObject = GameObject.Find("LIGHT_Moon").transform;
	skyObject = this.gameObject.Find("SkySphere");

	starfieldObject = this.gameObject.Find("SkySphereStar");
	starGalaxyObject = this.gameObject.Find("SkySphereGalaxy");

	if (this.gameObject.Find("planetMars")) planetObjMars = this.gameObject.Find("planetMars").gameObject.GetComponent(ParticlePlanetHandler) as ParticlePlanetHandler;
	if (this.gameObject.Find("planetMercury")) planetObjMercury = this.gameObject.Find("planetMercury").gameObject.GetComponent(ParticlePlanetHandler) as ParticlePlanetHandler;
	if (this.gameObject.Find("planetVenus")) planetObjVenus = this.gameObject.Find("planetVenus").gameObject.GetComponent(ParticlePlanetHandler) as ParticlePlanetHandler;
	if (this.gameObject.Find("planetJupiter")) planetObjJupiter = this.gameObject.Find("planetJupiter").gameObject.GetComponent(ParticlePlanetHandler) as ParticlePlanetHandler;
	if (this.gameObject.Find("planetSaturn")) planetObjSaturn = this.gameObject.Find("planetSaturn").gameObject.GetComponent(ParticlePlanetHandler) as ParticlePlanetHandler;
	if (this.gameObject.Find("planetUranus")) planetObjUranus = this.gameObject.Find("planetUranus").gameObject.GetComponent(ParticlePlanetHandler) as ParticlePlanetHandler;
	if (this.gameObject.Find("planetNeptune")) planetObjNeptune = this.gameObject.Find("planetNeptune").gameObject.GetComponent(ParticlePlanetHandler) as ParticlePlanetHandler;
		
	if (planetObjSaturn != null) planetRendererSaturn = this.gameObject.Find("planetSaturn").GetComponent(Renderer) as Renderer;
	if (planetObjJupiter != null) planetRendererJupiter = this.gameObject.Find("planetJupiter").GetComponent(Renderer) as Renderer;
	if (planetObjNeptune != null) planetRendererNeptune = this.gameObject.Find("planetNeptune").GetComponent(Renderer) as Renderer;
	if (planetObjUranus != null) planetRendererUranus = this.gameObject.Find("planetUranus").GetComponent(Renderer) as Renderer;
	if (planetObjMercury != null) planetRendererMercury = this.gameObject.Find("planetMercury").GetComponent(Renderer) as Renderer;
	if (planetObjVenus != null) planetRendererVenus = this.gameObject.Find("planetVenus").GetComponent(Renderer) as Renderer;
	if (planetObjMars != null) planetRendererMars = this.gameObject.Find("planetMars").GetComponent(Renderer) as Renderer;


	nightSkyLightObject = this.gameObject.Find("LIGHT_NightSky").transform;

	//GET SOUND OBJECT
	ambientSoundObject = this.gameObject.Find("AMBIENT_SOUNDS").gameObject.GetComponent(TenkokuGlobalSound) as TenkokuGlobalSound;

	//GET FLARE OBJECTS
    //sunFlare = sunObject.GetComponent(LensFlare);
    

	//GET WEATHER OBJECTS
	if (GameObject.Find("fxRain")) rainSystem = GameObject.Find("fxRain").gameObject.GetComponent(ParticleSystem);
	if (GameObject.Find("fxRainFog")) rainFogSystem = GameObject.Find("fxRainFog").gameObject.GetComponent(ParticleSystem);
	if (GameObject.Find("fxRainSplash")) rainSplashSystem = GameObject.Find("fxRainSplash").gameObject.GetComponent(ParticleSystem);
	if (GameObject.Find("fxSnow")) snowSystem = GameObject.Find("fxSnow").gameObject.GetComponent(ParticleSystem);
	if (GameObject.Find("fxFog")) fogSystem = GameObject.Find("fxFog").gameObject.GetComponent(ParticleSystem);
	

	//GET AURORA OBJECTS
	renderObjectAurora = GameObject.Find("fxAuroraPlane").gameObject.GetComponent(Renderer);
	renderObjectAurora.enabled = false;

	//GET COMPONENT REFERENCES
	lightObjectNight = nightSkyLightObject.GetComponent(Light);
	lightObjectWorld = worldlightObject.GetComponent(Light);


	renderObjectMoon = moonObject.GetComponent(Renderer);
	renderObjectGalaxy = starGalaxyObject.GetComponent(Renderer);

if (Application.isPlaying){
	if (rainSystem) renderObjectRain = rainSystem.GetComponent(Renderer);
	if (rainSplashSystem) renderObjectRainSplash = rainSplashSystem.GetComponent(Renderer);
	if (rainFogSystem) renderObjectRainFog = rainFogSystem.GetComponent(Renderer);
	if (fogSystem) renderObjectFog = fogSystem.GetComponent(Renderer);
	if (snowSystem) renderObjectSnow = snowSystem.GetComponent(Renderer);

	//if (renderObjectRain) renderObjectRain.enabled = false;
	//if (renderObjectRainSplash) renderObjectRainSplash.enabled = false;
	//if (renderObjectRainFog) renderObjectRainFog.enabled = false;
	//if (renderObjectFog) renderObjectFog.enabled = false;
	//if (renderObjectSnow) renderObjectSnow.enabled = false;

	if (rainFogSystem) particleObjectRainFog = rainFogSystem.GetComponent(ParticleSystem);
	if (rainSplashSystem) particleObjectRainSplash = rainSplashSystem.GetComponent(ParticleSystem);
	if (fogSystem) particleObjectFog = fogSystem.GetComponent(ParticleSystem);
}

	renderObjectCloudPlane = cloudPlaneObject.GetComponent(Renderer);

	fogCameraCam = GameObject.Find("Tenkoku_SkyFog").GetComponent(Camera);
	fogCameraBlur = GameObject.Find("Tenkoku_SkyFog").GetComponent(TenkokuSkyBlur) as TenkokuSkyBlur;


}
    
    


function HandleGlobalSound(){

    //--------------------------------------
    //---    CALCULATE MASTER VOLUME    ----
    //--------------------------------------
	overallVolume = Mathf.Clamp01(overallVolume);


    //---------------------------------------
    //---    CALCULATE ELEMENT VOLUME    ----
    //---------------------------------------
	ambientSoundObject.volWind = Mathf.Lerp(0.0,1.5,weather_WindAmt) * volumeWind * overallVolume;
	ambientSoundObject.volTurb1 = Mathf.Lerp(0.0,2.0,weather_WindAmt) * volumeTurb1 * overallVolume;
	ambientSoundObject.volTurb2 = Mathf.Lerp(-1.0,1.5,weather_WindAmt) * volumeTurb2 * overallVolume;
	ambientSoundObject.volRain = volumeRain * (weather_RainAmt*1.5) * overallVolume;


    //---------------------------------------------
    //---    CALCULATE AMBIENT AUDIO CURVES    ----
    //---------------------------------------------
	ambientSoundObject.volAmbNight = volumeAmbNight * curveAmbNight24.Evaluate(dayValue) * curveAmbNightYR.Evaluate(yearValue) * overallVolume;
	ambientSoundObject.volAmbDay = volumeAmbDay * curveAmbDay24.Evaluate(dayValue) * curveAmbDayYR.Evaluate(yearValue) * overallVolume;

    //-----------------------------------------
    //---    SEND DATA TO SOUND HANDLER    ----
    //-----------------------------------------
    ambientSoundObject.enableSounds = enableSoundFX;

	if (audioWind != null){
		ambientSoundObject.audioWind = audioWind;
	} else {
		ambientSoundObject.audioWind = null;
	}

	if (audioTurb1 != null){
		ambientSoundObject.audioTurb1 = audioTurb1;
	} else {
		ambientSoundObject.audioTurb1 = null;
	}

	if (audioTurb2 != null){
		ambientSoundObject.audioTurb2 = audioTurb2;
	} else {
		ambientSoundObject.audioTurb2 = null;
	}

	if (audioRain != null){
		ambientSoundObject.audioRain = audioRain;
	} else {
		ambientSoundObject.audioRain = null;
	}

	if (audioAmbDay != null){
		ambientSoundObject.audioAmbDay = audioAmbDay;
	} else {
		ambientSoundObject.audioAmbDay = null;
	}

	if (audioAmbNight != null){
		ambientSoundObject.audioAmbNight = audioAmbNight;
	} else {
		ambientSoundObject.audioAmbNight = null;
	}


}





function Update(){



    if (!doTransition){
    	useAutoTime = autoTime;
	}

	// EDITOR MODE SPECIFIC
	if (!Application.isPlaying){

		//set project layer masks
		tenLayerMasks = new Array();
		for (i = 0; i < 32; i++){
			layerName = LayerMask.LayerToName(i);
			tenLayerMasks.Add(layerName);
		}

		//get objects in editor mode
		LoadObjects();

		// Parent Tenkoku sky to scene camera when not Playing
		// This will help with better visuals during scene-view mode
		//var view = SceneView.lastActiveSceneView.camera;
		//if (view != null){
		    //skyObject = this.gameObject.Find("SkySphere");
		    //skyObject.transform.position = view.transform.position;
		   	//worldlightObject.transform.LookAt(skyObject.transform);
		//}
		//SceneView.RepaintAll();
  		
		//moonlightFaceObject.transform.LookAt(sunObject.transform);
    	//moonlightWorldObject.transform.LookAt(skyObject.transform);

    	//rotate sun in editor mode
    	sunlightObject.transform.LookAt(sunSphereObject.transform);
		worldlightObject.transform.localRotation = sunlightObject.transform.localRotation;
		lightObjectNight.transform.localRotation = moonObject.transform.localRotation;

		//set layers
		if (lightObjectWorld.gameObject.activeInHierarchy){
			lightObjectWorld.cullingMask = lightLayer;
			lightObjectNight.cullingMask = lightLayer;
		}


		//recalculate time
		TimeUpdate();

	}


	//track camera
	if (Application.isPlaying){
		UpdatePositions();
	}

}





function UpdatePositions(){

	// -------------------------------
	// --   SET SKY POSITIONING   ---
	// -------------------------------
	if (Application.isPlaying){

		// track positioning
		if (useCamera != null){
			skyObject.transform.position = useCamera.transform.position;
		
			//sky sizing based on camera
			if (useCameraCam != null){
			if (currClipDistance != useCameraCam.farClipPlane){
				currClipDistance = useCameraCam.farClipPlane;
				setSkySize = currClipDistance;
				setSkyUseSize = currClipDistance/20.0;

				cloudPlaneObject.transform.localScale = Vector3(0.5,0.5,0.1);
				sunSphereObject.transform.localScale = Vector3(setSkyUseSize,setSkyUseSize,setSkyUseSize);
				moonSphereObject.transform.localScale = Vector3(setSkyUseSize*0.95,setSkyUseSize*0.95,setSkyUseSize*0.95);

				starfieldObject.transform.localScale = Vector3(setSkyUseSize,setSkyUseSize,setSkyUseSize);
				starGalaxyObject.transform.localScale = Vector3(1.01,1.01,1.01);

			}
			}
		}
	}
}







function LateUpdate () {

//if (Application.isPlaying){

	//SET VERSION NUMBER
	tenkokuVersionNumber = "1.0.9b";



	// PLAY MODE SPECIFIC
	//if (Application.isPlaying){

		
		//force camera mode
		//if (manualCamera != null){
			//cameraTypeIndex = 1;
		//}

		//get main camera object
		if (cameraTypeIndex == 0){
			if (Camera.main != null){
				mainCamera = Camera.main.transform;
			}
			manualCamera = null;
		}
		if (cameraTypeIndex == 1){
			if (manualCamera != null){
				mainCamera = manualCamera;
			} else {
				if (Camera.main != null){
					mainCamera = Camera.main.transform;
				}
			}
		}
		if (useCamera != mainCamera){ 
			//update camera reference flag
			useCamera = mainCamera;
		}


	if (Application.isPlaying){
		//set project layer masks
		tenLayerMasks = new Array();
		for (i = 0; i < 32; i++){
			layerName = LayerMask.LayerToName(i);
			tenLayerMasks.Add(layerName);
		}
	}


	//TURN OFF BUILT-IN FOG
	if (enableFog) RenderSettings.fog = false;

	//TURN OFF ANTI ALIASING
	if (enableFog) QualitySettings.antiAliasing = 0;

	//SYNC TIME TO SYSTEM
	if (Application.isPlaying){
		if (autoTimeSync || autoDateSync){

			sysTime = System.DateTime.Now;
			
			if (autoTimeSync){
				currentHour = Mathf.Floor(sysTime.Hour);
				currentMinute = Mathf.Floor(sysTime.Minute);
				currentSecond = Mathf.Floor(sysTime.Second);
				useTimeCompression = 1.0;
			}
			if (autoDateSync){
				currentYear = Mathf.Floor(sysTime.Year);
				currentMonth = Mathf.Floor(sysTime.Month);
				currentDay = Mathf.Floor(sysTime.Day);
			}

			

		} else {
			if (!doTransition){
				useTimeCompression = timeCompression;
			}
		}
	}


	//SET LIGHTING LAYERS
	if (Application.isPlaying){
		if (lightObjectWorld.gameObject.activeInHierarchy){
			lightObjectWorld.cullingMask = lightLayer;
			lightObjectNight.cullingMask = lightLayer;
		}
	}


    // -----------------------------
	// --   GET CAMERA OBJECTS   ---
	// -----------------------------


	if (Application.isPlaying){
		if (useCameraCam == null && mainCamera != null){
			useCamera = mainCamera;
			useCameraCam = useCamera.GetComponent(Camera);
			useCameraCam.clearFlags = CameraClearFlags.Skybox;
		}
	}

	if (useCameraCam != null){
		MV = useCameraCam.worldToCameraMatrix.inverse;
		Shader.SetGlobalMatrix("_Tenkoku_CameraMV",MV);
	}

	if (useCamera != mainCamera && mainCamera != null){
		useCamera = mainCamera;
		useCameraCam = useCameraCam = useCamera.GetComponent(Camera);
	}



    // -------------------------------
	// --   SET REFLECTION PROBE   ---
	// -------------------------------
	if (tenkokuReflectionObject != null){

		if (enableProbe){

			//enable probe
			tenkokuReflectionObject.enabled = true;

			//set size to world size
			if (useCameraCam != null){
				tenkokuReflectionObject.size = Vector3(useCameraCam.farClipPlane,useCameraCam.farClipPlane,useCameraCam.farClipPlane);
			}

			//handle probe update when set to "scripting"
			if (Application.isPlaying){
				if (tenkokuReflectionObject.refreshMode == Rendering.ReflectionProbeRefreshMode.ViaScripting){
					reflectionTimer += Time.deltaTime;
					if (reflectionTimer >= (1.0/reflectionProbeFPS)){
						tenkokuReflectionObject.RenderProbe(null);
						reflectionTimer = 0.0;
					}
				}
			}


		} else {
			//disable probe
			tenkokuReflectionObject.enabled = false;
		}
		
	}



    // --------------------
	// --   SET FLAGS   ---
	// --------------------
	//set ible active
	iblActive = 0.0;

	if (iblActive != currIblActive){
		currIblActive = iblActive;
		Shader.SetGlobalFloat("_tenkokuIBLActive",iblActive);
	}
	
	//Set Linear Mode on Shader
	isLin = 0.0;
	if (QualitySettings.activeColorSpace == ColorSpace.Linear) isLin = 1.0;
	if (isLin != currIsLin){
		currIsLin = isLin;
		Shader.SetGlobalFloat("_tenkokuIsLinear",isLin);
	}




    // --------------------------------
	// --   CALCULATE WEATHER   ---
	// --------------------------------
	if (weatherTypeIndex == 1){

		//calculate weather pattern timer and initialize update
		doWeatherUpdate = false;
		weather_PatternTime += Time.deltaTime;
				
		//inherit variables
		if (currentWeatherTypeIndex != weatherTypeIndex ){
			currentWeatherTypeIndex = weatherTypeIndex;
			doWeatherUpdate = true;
		}

		//check for weather update
		if (weather_PatternTime > (weather_autoForecastTime*60.0) && weather_autoForecastTime >= 0.05) doWeatherUpdate = true;
		if (weather_forceUpdate) doWeatherUpdate = true;
		
		if (doWeatherUpdate){
			weather_forceUpdate = false;
			weather_PatternTime = 0.0;
			
			//determine next random weather pattern
			TenRandom.seed = System.Environment.TickCount;
			w_isCloudy = Mathf.Clamp(TenRandom.Range(-0.25,1.5),0.0,1.0);
			
			//record current weather
			w_cloudAmts.y = weather_cloudAltoStratusAmt;
			w_cloudAmts.z = weather_cloudCirrusAmt;
			w_cloudAmtCumulus = weather_cloudCumulusAmt;
			w_overcastAmt = weather_OvercastAmt;
			w_windCAmt = weather_cloudSpeed;
			w_windAmt = weather_WindAmt;
			w_rainAmt = weather_RainAmt;
			
			//set clear weather default
			w_cloudTgts = Vector4(0,0,0,0);
			w_cloudTgtCumulus = 0.0;
			w_overcastTgt = 0.0;
			w_windCTgt = 0.0;
			w_windTgt = 0.0;
			w_rainTgt = 0.0;
			
			//set clouds
			w_cloudTgts.y = Mathf.Clamp(Mathf.Lerp(0.0,TenRandom.Range(0.0,0.4),w_isCloudy),0.0,0.4); //AltoCumulus
			w_cloudTgts.z = Mathf.Clamp(Mathf.Lerp(0.0,TenRandom.Range(0.0,0.8),w_isCloudy),0.0,0.8); //Cirrus
			w_cloudTgtCumulus = Mathf.Clamp(Mathf.Lerp(0.0,TenRandom.Range(0.1,1.25),w_isCloudy),0.0,1.0); // Cumulus
			if (w_cloudTgtCumulus > 0.8){
				w_overcastTgt = Mathf.Clamp(Mathf.Lerp(0.0,TenRandom.Range(0.0,1.0),w_isCloudy),0.0,1.0); // overcast amount
			}
			
			//set weather
			chanceOfRain = Mathf.Clamp(TenRandom.Range(-1.0,1.0),0.0,1.0);
			w_rainTgt = Mathf.Lerp(0.0,TenRandom.Range(0.2,1.4),w_overcastTgt*chanceOfRain);

			//set wind
			w_windCTgt = TenRandom.Range(0.1,0.3);
			w_windTgt = TenRandom.Range(0.1,0.5)+Mathf.Lerp(0.0,0.5,weather_OvercastAmt);
			
		}

		//set weather systems
		weather_cloudAltoStratusAmt = Mathf.SmoothStep(w_cloudAmts.y,w_cloudTgts.y,(weather_PatternTime/(weather_TransitionTime*60.0)));
		weather_cloudCirrusAmt = Mathf.SmoothStep(w_cloudAmts.z,w_cloudTgts.z,(weather_PatternTime/(weather_TransitionTime*60.0)));
		weather_cloudCumulusAmt = Mathf.SmoothStep(w_cloudAmtCumulus,w_cloudTgtCumulus,(weather_PatternTime/(weather_TransitionTime*60.0)));
		weather_OvercastAmt = Mathf.SmoothStep(w_overcastAmt,w_overcastTgt,(weather_PatternTime/(weather_TransitionTime*60.0)));
		weather_cloudSpeed = Mathf.SmoothStep(w_windCAmt,w_windCTgt,(weather_PatternTime/(weather_TransitionTime*60.0)));
		weather_WindAmt = Mathf.SmoothStep(w_windAmt,w_windTgt,(weather_PatternTime/(weather_TransitionTime*60.0)));
		weather_RainAmt = Mathf.SmoothStep(w_rainAmt,w_rainTgt,(weather_PatternTime/(weather_TransitionTime*60.0))*2.0);

		//extra modifiers
		weather_RainAmt *= Mathf.Lerp(-1.0,1.0,weather_OvercastAmt);


	}


	//Handle Temperature
	Shader.SetGlobalFloat("_Tenkoku_HeatDistortAmt",Mathf.Lerp(0.0,0.04,Mathf.Clamp(weather_temperature-90.0,0.0,120.0)/30.0));



    // --------------------
	// --   SET sOUND   ---
	// --------------------
	//if (Time.time < 1.0) overallVolume = Time.time;
	HandleGlobalSound();
	

    // -------------------------------------
	// --   CALCULATE WIND COORDINATES   ---
	// -------------------------------------
	weather_WindCoords = TenkokuConvertAngleToVector(weather_WindDir);
	tenkokuWindObject.transform.eulerAngles.y = weather_WindDir;
	tenkokuWindObject.windMain = weather_WindAmt;
	tenkokuWindObject.windTurbulence = Mathf.Lerp(0.0,0.4,weather_WindAmt);
	tenkokuWindObject.windPulseMagnitude = Mathf.Lerp(0.0,2.0,weather_WindAmt);
	tenkokuWindObject.windPulseFrequency = Mathf.Lerp(0.0,0.4,weather_WindAmt);


    // --------------------------------
	// --   SET ECLIPTIC ROTATION   ---
	// --------------------------------
    yAmt = ((calcComponent.yamt+calcComponent.day)/365.242)*2.0;
    setEcliptic = Mathf.PingPong(yAmt*23.4*2,23.4*2);
    setEcliptic = Mathf.Sin(((calcComponent.yamt+calcComponent.day)/(365.242*0.15915)))*15;//*23.4;
	useLatitude = setLatitude;



    // ----------------------------
	// --   SET DAYLIGHT TIME   ---
	// ----------------------------
	calcTime = Vector3.Angle((sunObject.transform.position - skyObject.transform.position),skyObject.transform.up) / 180.0;
	calcTime = 1.0-calcTime;
	setTime = calcTime*1.0*colorRamp.width;
	stepTime = Mathf.Floor(setTime);
	timeLerp = setTime - stepTime;


    // ----------------------------
	// --   SET MOONLIGHT TIME   ---
	// ----------------------------
	calcTimeM = Vector3.Angle((moonObject.transform.position - skyObject.transform.position),skyObject.transform.up) / 180.0;
	calcTimeM = 1.0-calcTimeM;
	setTimeM = calcTimeM*1.0*colorRamp.width;
	stepTimeM = Mathf.Floor(setTimeM);
	timeLerpM = setTimeM - stepTimeM;


	
	// --------------
	// --   SUN   ---
	// --------------
	if (sunTypeIndex == 2){
		sunIsVisible = false;
	} else {
		sunIsVisible = true;
	}
	

		sunSphereObject.gameObject.SetActive(true);
    	sunObject.gameObject.SetActive(true);
	    sunlightObject.gameObject.SetActive(true);
	    

	   	//solar ecliptic movement
		calcComponent.CalculateNode("sunstatic");
		if (calcComponent.azimuth > 180.0){
			eclipticAngle = (calcComponent.azimuth);
		} else {
			eclipticAngle = (calcComponent.azimuth);
		}
		eclipticoffset = 0.0;

	    sunObject.transform.localPosition = Vector3(-0.51,0,0);
	    sunSphereObject.transform.localPosition = Vector3(0,0,0);

		//sun initial position and light
		//direction based on Solar Day Calculation
	    calcComponent.CalculateNode("sun");
		sunSphereObject.transform.localEulerAngles.x = 0.0;
		sunSphereObject.transform.localEulerAngles.y = 90+calcComponent.azimuth+setRotation+0.5;
		sunSphereObject.transform.localEulerAngles.z = -180.0+calcComponent.altitude-0.5;


	    //sun apparent horizon size
	    //due to optical atmospheric refraction as well as relative viusal proportion artifacts
	    //at the horizon, the sun appears larger at the horizon than it does while overhead.
	    //we're artificially changing the size of the sun to simulate this visual trickery.
	    sSDiv = Mathf.Abs((sunSphereObject.transform.eulerAngles.z-180.0)/180.0);
	    if (sSDiv == 0.0) sSDiv = 1.0;
	    if (sSDiv < 0.5 && sSDiv > 0.0) sSDiv = 0.5 + (0.5 - sSDiv);
	    sunCalcSize = sunSize + Mathf.Lerp(0.0,(sunSize * Mathf.Lerp(-2.0,2.0,sSDiv)),Mathf.Lerp(-1.0,1.0,sSDiv));
	    
	    //set explicit size of sun in Custom mode
	    sunCalcSize = sunSize*0.5;
	    Shader.SetGlobalFloat("_Tenkoku_SunSize",sunSize+0.005);

		sunPos.x = sunObject.transform.position.x/360.0;
		sunPos.y = sunObject.transform.position.y/360.0;
		sunPos.z = sunObject.transform.position.z/360.0;
		Shader.SetGlobalColor("_Tenkoku_SunPos",Vector4(sunPos.x,sunPos.y,sunPos.z,0.0));

		sunObject.transform.localScale = Vector3(sunCalcSize,sunCalcSize,sunCalcSize);
	
	    //solar parhelion
	    //models the non-circular orbit of the earth.  The sun is not a constant distance
	    //varying over the course of the year, this offsets the perceived sunset and
	    //sunrise times from where they would be given a perfectly circular orbit.
	    //--- no code yet ---
	    

	    //sun color
	    colorSun = DecodeColorKey("sun");

	    //lightObjectSun.color = colorSun;
	    sunColor = colorSun * (ambientCol.r);

	    //sun lightsource, point toward camera
	    if (useCamera != null){
	    	sunlightObject.transform.LookAt(useCamera.transform);
	    }





    // ---------------
	// --   MOON   ---
	// ---------------

	if (moonTypeIndex == 2){
		moonIsVisible = false;
	} else {
		moonIsVisible = true;
	}
	
	if (!moonIsVisible){
	    renderObjectMoon.enabled = false;
	} else {
		renderObjectMoon.enabled = true;
	}
	

	//Moon Realistic Movement
    //moon position and light direction
    //rotate the moon around a spherical axis centered on the earth
	moonObject.transform.localPosition = Vector3(-0.49,0,0);
	moonSphereObject.transform.localPosition = Vector3(0,0,0);

	calcComponent.CalculateNode("moon");
	moonSphereObject.transform.localEulerAngles.x = 0;
	moonSphereObject.transform.localEulerAngles.y = 90+calcComponent.azimuth+setRotation+0.15;
	moonSphereObject.transform.localEulerAngles.z = -180+calcComponent.altitude-0.5;


	moonAngle = 0.0;
    if (moonTypeIndex == 1){
    	//Moon Simple Movement
    	moonAngle = moonPos;
    } else {
    	//Realistic Moon Movement
		moonAngle = 0.0;
	}
	

    //moon phase
    //change the visual phase of the moon based on the relative position of the sun
    moonPhac = 5.0;
   	if (useCamera != null){
	    if (moonTypeIndex == 0){
		    renderObjectMoon.sharedMaterial.SetFloat("newMoonFac",floatRound(moonPhac));
	    } else if (moonTypeIndex == 1){
	    	if (moonPhase < 25.0 || moonPhase > 340.0) moonPhac = 1000.0;
	    	renderObjectMoon.sharedMaterial.SetFloat("newMoonFac",floatRound(moonPhac));
		}
	}	

    //moon libration
    //as the moon travels across the lunar month it appears to wobbleback and
    //forth as it transits from one phase to another.  This is called "libration"
    //var monthAngle = (monthValue);
    //if (monthAngle == 0.0) monthAngle = 1.0;
    //if (monthAngle < 0.5 && monthAngle > 0.0) monthAngle = 0.5 + (0.5 - monthAngle);
    //moonObject.transform.localEulerAngles.z = 0.0-Mathf.SmoothStep(336.0,384.0,Mathf.Lerp(-1.0,1.0,moonClipAngle));


    //moon horizon size - turned off for now
    //due to optical atmospheric refraction as well as relative viusal proportion artifacts
    //at the horizon, the moon appears larger at the horizon than it does while overhead.
    //we're artificially changing the size of the moon to simulate this visual trickery.
    //also due to libration the moon also appears larger and smaller over the course of it's phase.
    //var mSDiv : float = Mathf.Abs(moonSphereObject.transform.eulerAngles.z/180.0);
    //if (mSDiv == 0.0) mSDiv = 1.0;
    //if (mSDiv < 0.5 && mSDiv > 0.0) mSDiv = 0.5 + (0.5 - mSDiv);


     //set explicit size of sun in Custom mode
    moonCalcSize = moonSize;


    // moon apogee and perigree
    moonApoSize = Mathf.Lerp(1.2,0.82,calcComponent.moonApogee);
    //moonCalcSize = moonSize * moonApoSize;
    moonCalcSize *=  moonApoSize;
    moonObject.transform.localScale = Vector3(moonCalcSize,moonCalcSize,moonCalcSize);

    //moon color
	colorMoon = DecodeColorKey("moon")*1.0;
	colorSkyAmbient = DecodeColorKey("skyambient");

	     
    moonLightIntensity = Mathf.Clamp(moonLightIntensity,0.0,1.0);
    moonInt = monthValue;
    if (monthValue < 0.5) moonInt = (1.0 - monthValue);
    moonInt = sunSphereObject.transform.localEulerAngles.z / 360.0;
    moonInt = 1.0;

    moonWorlIntensity = 1.0 * (1.0-ambientCol.r) * colorMoon.r;// * moonInt;

    //moon day fade
    // we apply an extra fade during daylight hours so the moon recedes into the sky.
    // it is still visible, yet it's visiblilty is superceded by the bright atmosphere.
    moonDayIntensity = Mathf.Clamp(moonDayIntensity,0.0,1.0);
    mDCol = Color(0.5,0.5,0.5,1.0);
    mDCol.a = Mathf.Lerp(1.0,moonDayIntensity,colorSkyAmbient.r);

    renderObjectMoon.sharedMaterial.SetColor("_Color", Color.Lerp(mDCol,(ambientCol*colorSun),ambientCol.r)*mDCol);
	renderObjectMoon.sharedMaterial.SetColor("_AmbientTint",ambientCol);

	//moon light intensity
    setMCol = moonWorlIntensity;
	renderObjectMoon.sharedMaterial.SetColor("_AmbientTint",colorSkyAmbient);

	//set moon face light color
	moonFaceCol = colorMoon*(1.0-DecodeColorKey("ambient").r);
	Shader.SetGlobalColor("Tenkoku_MoonLightColor",moonFaceCol);




 	//SET SKY CAMERA POSITION
	if (useCamera != null){
		//set global shader for camera forward direction
		Shader.SetGlobalVector("Tenkoku_Vec_CameraFwd", useCamera.transform.forward);
		Shader.SetGlobalVector("Tenkoku_Vec_SunFwd", -sunlightObject.transform.forward); 
		Shader.SetGlobalVector("Tenkoku_Vec_MoonFwd", -moonlightObject.transform.forward); 
	}	
	
	





	
    // ---------------------------------
	// --   SOLAR ECLIPSE HANDLING   ---
	// ---------------------------------
	solarSetInten = 1.0;
	ecldiff = 2.0;
	ecldiff = Vector3.Distance(moonObject.transform.eulerAngles,sunlightObject.transform.eulerAngles);
	solarSetInten = Mathf.Lerp(0.0,1.0,(ecldiff-0.168978)*4.0);
	solarSetInten = ecldiff;
	eclAnnular = Mathf.Clamp((Mathf.Clamp(Mathf.Abs(sunCalcSize) - Mathf.Abs(moonCalcSize),0.0,1.0)*100.0)/0.4,0.0,1.0);
	solarSetInten += eclAnnular;

	





    // ------------------
	// --   PLANETS   ---
	// ------------------
	useVec = Vector3(0,0.35,0.75);
	useMult = 1.0;
	//pVisFac = 1.0-(0.68);
	pVisFac = Mathf.Lerp(0.75,0.1,colorSkyAmbient.r);
	
	if (Application.isPlaying){

		//enable visibility
		if (planetRendererSaturn != null) planetRendererSaturn.enabled = true;
		if (planetRendererJupiter != null) planetRendererJupiter.enabled = true;
		if (planetRendererNeptune != null) planetRendererNeptune.enabled = true;
		if (planetRendererUranus != null) planetRendererUranus.enabled = true;
		if (planetRendererMercury != null) planetRendererMercury.enabled = true; 
		if (planetRendererVenus != null) planetRendererVenus.enabled = true;
		if (planetRendererMars != null) planetRendererMars.enabled = true;
    

		//set planetary positions
		if (planetObjMercury){
		calcComponent.CalculateNode("mercury");
		planetObjMercury.transform.localPosition = Vector3(0,0,0);
		planetObjMercury.transform.localEulerAngles.x = 0.0;
		planetObjMercury.transform.localEulerAngles.y = 90.0+calcComponent.azimuth+setRotation;
		planetObjMercury.transform.localEulerAngles.z = -180.0+calcComponent.altitude-0.5;
		tempTrans = planetObjMercury.transform;
		tempTrans.localPosition = Vector3(0,0,0);
		tempTrans.Translate(useVec * (eclipticoffset*useMult), Space.World);
	    planetObjMercury.planetOffset = tempTrans.localPosition;
	 	planetObjMercury.planetVis = pVisFac * planetIntensity;
	 	}

	 	if (planetObjVenus){
	 	calcComponent.CalculateNode("venus");
		planetObjVenus.transform.localPosition = Vector3(0,0,0);
		planetObjVenus.transform.localEulerAngles.x = 0.0;
		planetObjVenus.transform.localEulerAngles.y = 90.0+calcComponent.azimuth+setRotation+0.5;
		planetObjVenus.transform.localEulerAngles.z = -180.0+calcComponent.altitude-0.5;
		tempTrans = planetObjVenus.transform;
		tempTrans.localPosition = Vector3(0,0,0);
		tempTrans.Translate(useVec * (eclipticoffset*useMult), Space.World);
	    planetObjVenus.planetOffset = tempTrans.localPosition;
	 	planetObjVenus.planetVis = Mathf.Clamp(pVisFac,0.1,1.0) * planetIntensity;
	 	}

	 	if (planetObjMars){
	  	calcComponent.CalculateNode("mars");
		planetObjMars.transform.localPosition = Vector3(0,0,0);
		planetObjMars.transform.localEulerAngles.x = 0.0;
		planetObjMars.transform.localEulerAngles.y = 90.0+calcComponent.azimuth+setRotation+0.5;
		planetObjMars.transform.localEulerAngles.z = -180.0+calcComponent.altitude-0.5;
		tempTrans = planetObjMars.transform;
		tempTrans.localPosition = Vector3(0,0,0);
		tempTrans.Translate(useVec * (eclipticoffset*useMult), Space.World);
	    planetObjMars.planetOffset = tempTrans.localPosition;
	 	planetObjMars.planetVis = Mathf.Clamp(pVisFac,0.02,1.0) * planetIntensity;
	 	}

	 	if (planetObjJupiter){
	  	calcComponent.CalculateNode("jupiter");
		planetObjJupiter.transform.localPosition = Vector3(0,0,0);
		planetObjJupiter.transform.localEulerAngles.x = 0.0;
		planetObjJupiter.transform.localEulerAngles.y = 90.0+calcComponent.azimuth+setRotation;
		planetObjJupiter.transform.localEulerAngles.z = -180.0+calcComponent.altitude-0.7;
		tempTrans = planetObjJupiter.transform;
		tempTrans.localPosition = Vector3(0,0,0);
		tempTrans.Translate(useVec * (eclipticoffset*useMult), Space.World);
	    planetObjJupiter.planetOffset = tempTrans.localPosition;
	    planetObjJupiter.planetVis = Mathf.Clamp(pVisFac,0.05,1.0) * planetIntensity;
	    }

	    if (planetObjSaturn){
	 	calcComponent.CalculateNode("saturn");
		planetObjSaturn.transform.localPosition = Vector3(0,0,0);
		planetObjSaturn.transform.localEulerAngles.x = 0.0;
		planetObjSaturn.transform.localEulerAngles.y = 90.0+calcComponent.azimuth+setRotation;
		planetObjSaturn.transform.localEulerAngles.z = -180.0+calcComponent.altitude-0.5;
		tempTrans = planetObjSaturn.transform;
		tempTrans.localPosition = Vector3(0,0,0);
		tempTrans.Translate(useVec * (eclipticoffset*useMult), Space.World);
	    planetObjSaturn.planetOffset = tempTrans.localPosition;
	  	planetObjSaturn.planetVis = pVisFac * planetIntensity;
	    }

	    if (planetObjUranus){
		calcComponent.CalculateNode("uranus");
		planetObjUranus.transform.localPosition = Vector3(0,0,0);
		planetObjUranus.transform.localEulerAngles.x = 0.0;
		planetObjUranus.transform.localEulerAngles.y = 90.0+calcComponent.azimuth+setRotation;
		planetObjUranus.transform.localEulerAngles.z = -180.0+calcComponent.altitude-0.5;
		tempTrans = planetObjUranus.transform;
		tempTrans.localPosition = Vector3(0,0,0);
		tempTrans.Translate(useVec * (eclipticoffset*useMult), Space.World);
	    planetObjUranus.planetOffset = tempTrans.localPosition; 
		planetObjUranus.planetVis = pVisFac * planetIntensity;
		}

		if (planetObjNeptune){
		calcComponent.CalculateNode("neptune");
		planetObjNeptune.transform.localPosition = Vector3(0,0,0);
		planetObjNeptune.transform.localEulerAngles.x = 0.0;
		planetObjNeptune.transform.localEulerAngles.y = 90.0+calcComponent.azimuth+setRotation;
		planetObjNeptune.transform.localEulerAngles.z = -180.0+calcComponent.altitude-0.5;
		tempTrans = planetObjNeptune.transform;
		tempTrans.localPosition = Vector3(0,0,0);
		tempTrans.Translate(useVec * (eclipticoffset*useMult), Space.World);
	    planetObjNeptune.planetOffset = tempTrans.localPosition; 
	    planetObjNeptune.planetVis = pVisFac * planetIntensity;
	    }
	    
    }


    // ----------------
	// --   STARS   ---
	// ----------------

    //SIDEAREAL DAY CALCULATION
	//The sideareal day is more accurate than the solar day, and is
	//the actual determining calculation for the passage of a full year.
	if (starTypeIndex == 0 || starTypeIndex == 2){
	
	    starAngle = -1.0;
	    starTarget = Quaternion.Euler((useLatitude), 183.0, -starAngle);
	    starfieldObject.transform.rotation = starTarget;
		starfieldObject.transform.eulerAngles.z = -(((calcComponent.UT/23.99972))*360.0);
		starfieldObject.transform.eulerAngles.z -= (setLongitude)+95.0;
		starfieldObject.transform.eulerAngles.z -= (360.0*Mathf.Abs(Mathf.Floor(calcComponent.day/365.25)-(calcComponent.day/365.25)));

	    //CALCULATE PRECESSIONAL MOVEMENT
		//precessional movement occurs at a rate of 1 degree every 71.666 years, thus each precessional epoch
		//takes up exactly 32 degrees on the spherical celestial star plane. this is calculated on the
		//assumption that the Aquarial age begins in the year 2600ad.  if you disagree and would like to
		//see other aquarian start calibrations (year 2148 for example), simply change the 'aquarialStart' variable.
		aquarialStart = 2600;
		precRate = 71.6;
		precNudge = 258.58; //this value simply helps set the exact position of the star sphere.
		precFactor = ((aquarialStart/precRate)*(aquarialStart))+((aquarialStart-currentYear)/precRate)+precNudge;
		starfieldObject.transform.eulerAngles.z -= precFactor;

		//nudge
		starfieldObject.transform.eulerAngles.z -= 4.0;

	} else {
		starfieldObject.transform.eulerAngles.z = starPos;
	}

	starfieldObject.transform.eulerAngles.y = setRotation;

			

    //solar ecliptic movement
    eclipticStarAngle = (starValue);
    if (eclipticStarAngle == 0.0) eclipticStarAngle = 1.0;
    if (eclipticStarAngle < 0.5 && eclipticStarAngle > 0.0) eclipticStarAngle = 0.5 + (0.5 - eclipticStarAngle);
    eclipticStarAngle += 1.35;

   
    //GALAXY / Skybox Rendering
	renderObjectGalaxy.enabled = true;
	useGalaxyIntensity = galaxyIntensity;
    if (galaxyTypeIndex == 2 && starTypeIndex == 2){
		renderObjectGalaxy.enabled = false;
    } else {
    	renderObjectGalaxy.enabled = true;

    	// Realistic Galaxy Rotation (match star positions)
		if (galaxyTypeIndex == 0 || galaxyTypeIndex == 2){
			//starGalaxyObject.transform.localEulerAngles = Vector3(346.4,282.4,66.3);
			starGalaxyObject.transform.localEulerAngles = Vector3(20,280,336);
		}

		// Custom Galaxy Rotation
		if (galaxyTypeIndex == 1){
			starGalaxyObject.transform.localEulerAngles.z = galaxyPos;
		}

    }
    galaxyColor = Color(1.0,1.0,1.0,1.0);
   	galaxyVis = (1.0-(colorSkyAmbient.r*1.0)) * galaxyIntensity;

    renderObjectGalaxy.sharedMaterial.SetFloat("_GIntensity",galaxyVis);
    renderObjectGalaxy.sharedMaterial.SetColor("_Color",galaxyColor);

	renderObjectGalaxy.sharedMaterial.SetFloat("_useGlxy",galaxyTypeIndex*1.0);
	renderObjectGalaxy.sharedMaterial.SetTexture("_GTex",galaxyTex);

	renderObjectGalaxy.sharedMaterial.SetFloat("_useCube",galaxyTexIndex*1.0);
	renderObjectGalaxy.sharedMaterial.SetTexture("_CubeTex",galaxyCubeTex);

	renderObjectGalaxy.sharedMaterial.SetFloat("_useStar",starTypeIndex*1.0);
    renderObjectGalaxy.sharedMaterial.SetFloat("_SIntensity",starIntensity);

    
    
    



    // --------------
    // --   SKY   ---   
    //---------------                                                                                                                                                                                                                                                  
    //get ramp colors
	ambientShift = Mathf.Clamp(ambientShift,0.0,1.0);
    colorSkyBase = DecodeColorKey("skybase");
    ambientCol = DecodeColorKey("skyambient");
    ambientCloudCol = DecodeColorKey("ambientcloud");           
                   
	setSkyAmbient = colorSkyAmbient;
	setSkyAmbient.r += ambientShift;
	setSkyAmbient.g += ambientShift;
	setSkyAmbient.b += ambientShift;
	useAlpha = Color(1.0,1.0,1.0, (1.0-setSkyAmbient.r));
	
	setAmbCol = useAlpha;
	setAmbCol.a = useAlpha.a*0.75;
	setAmbCol.a = useAlpha.a*1.5;
	if (setAmbCol.a > 1.0) setAmbCol.a = 1.0;

	colorSkyBaseLow = colorSkyBase;
	colorHorizonLow = colorHorizon;
	
	colorSkyBase = (colorSkyBase * 0.8);
	colorHorizon = Color.Lerp(colorHorizon,(colorSkyBase),0.9)*1.1;

	
	
	

    // ------------------
    // --   AMBIENT   ---   
    //-------------------
	mixColor = colorSun;
	setAmbientColor.r = 1.0-mixColor.r;
	setAmbientColor.g = 1.0-mixColor.g;
	setAmbientColor.b = 1.0-mixColor.b;
	medCol = Color(0.3,0.3,0.3,1.0);
	useAmbientColor = Color.Lerp((Color.Lerp(colorSkyBase,setAmbientColor,0.7)),Color(0,0,0,1),0.12);

	useAmbientColor = Color.Lerp(useAmbientColor,medCol,0.5) * colorSkyAmbient;
	useAmbientColor *= (sunBright) * skyBrightness;
	
	if (useAmbient){
		useAmbientColor = DecodeColorKey("ambientcolor");
		useAmbientColor = Color.Lerp(useAmbientColor,useAmbientColor*colorAmbient,colorAmbient.a);
		//RenderSettings.ambientLight = useAmbientColor;

		// Unity 5 no longer respects the previous RenderSettings for ambient color.
		// this may be a bug, but in the meantime the below settings duplicate
		// the original intended behavior.
		//RenderSettings.ambientMode = Rendering.AmbientMode.Flat;
		RenderSettings.ambientSkyColor = Color.Lerp((Color(0.38,0.6,0.69,0.7)*(nightBrightness*0.5)), useAmbientColor, setSkyAmbient.r);
		RenderSettings.ambientIntensity = 1.0;

	}
	
	
	//HORIZON
    colorHorizon = DecodeColorKey("colorhorizon")*1.2; 


 


     // ----------------------------------
    // --      LENS FLARE EFFECTS       --
    // -----------------------------------
    /*
    //set default flare
    sunFlare.color = Color(1,1,1,1);

    //fade flare based on overcast
    sunFlare.color = Color.Lerp(sunFlare.color,Color(0,0,0,0),weather_OvercastAmt*2.0);
	sunFlare.brightness = Mathf.Lerp(1.0,0.0,weather_OvercastAmt*2.0);

    //fade flare based on gamma
    sunFlare.color *= Mathf.Lerp(0.25,1.0,isLin);
	sunFlare.brightness *= Mathf.Lerp(0.25,1.0,isLin);

    //fade flare based on brightness
    sunFlare.color *= Mathf.Lerp(0.0,1.0,sunBright*0.6);
	sunFlare.brightness *= Mathf.Lerp(0.0,1.0,sunBright*0.6);

	//fade flare based on occlusion
	//(soon)
	*/





    // --------------------------------
    // --      WEATHER EFFECTS       --
    // --------------------------------
    if (Application.isPlaying){

	    //manage particle systems
		if (rainSystem != null){
			#if UNITY_5_3 || UNITY_5_4 || UNITY_5_6 || UNITY_5_7 || UNITY_5_8 || UNITY_5_9
				rainEmission = rainSystem.emission;
				rainEmission.enabled = true;
				rainEmission.rate = ParticleSystem.MinMaxCurve(weather_RainAmt,Mathf.Lerp(2,5000,weather_RainAmt));
				if (rainSystem.particleCount <= 10){
					renderObjectRain.enabled = false;
				} else {
					renderObjectRain.enabled = true;
				}
				//add force
				rainForces = rainSystem.forceOverLifetime;
				rainForces.enabled = true;
				rainForces.x = ParticleSystem.MinMaxCurve(-weather_WindCoords.x * (weather_WindAmt*46));
				rainForces.y = ParticleSystem.MinMaxCurve(weather_WindCoords.y * (weather_WindAmt*46));
			#else
				renderObjectRain.enabled = true;	
				rainSystem.enableEmission = true;
				rainSystem.emissionRate = Mathf.Floor(Mathf.Lerp(0,5000,weather_RainAmt));
			#endif
		}

		if (rainFogSystem != null){
			#if UNITY_5_3 || UNITY_5_4 || UNITY_5_6 || UNITY_5_7 || UNITY_5_8 || UNITY_5_9
				rainFogEmission = rainFogSystem.emission;
				rainFogEmission.enabled = true;
				rainFogEmission.rate = ParticleSystem.MinMaxCurve(weather_RainAmt,Mathf.Lerp(2,800,weather_RainAmt));
				if (rainFogSystem.particleCount <= 20){
					renderObjectRainFog.enabled = false;
				} else {
					renderObjectRainFog.enabled = true;
				}
				//add force
				rainFogForces = rainFogSystem.forceOverLifetime;
				rainFogForces.enabled = true;
				rainFogForces.x = ParticleSystem.MinMaxCurve(-weather_WindCoords.x * (weather_WindAmt*4));
				rainFogForces.y = ParticleSystem.MinMaxCurve(weather_WindCoords.y * (weather_WindAmt*4));
			#else
				rainFogSystem.enableEmission = true;
				renderObjectRainFog.enabled = true;
				rainFogSystem.emissionRate = Mathf.Floor(Mathf.Lerp(0,800,weather_RainAmt));
			#endif
		}

		if (rainSplashSystem != null){
			#if UNITY_5_3 || UNITY_5_4 || UNITY_5_6 || UNITY_5_7 || UNITY_5_8 || UNITY_5_9
				splashEmission = rainSplashSystem.emission;
				splashEmission.enabled = true;
				splashEmission.rate = ParticleSystem.MinMaxCurve(weather_RainAmt,Mathf.Lerp(50,800,weather_RainAmt));
				if (rainSplashSystem.particleCount <= 10){
					renderObjectRainSplash.enabled = false;
				} else {
					renderObjectRainSplash.enabled = true;
				}
			#else
				rainSplashSystem.enableEmission = true;
				renderObjectRainSplash.enabled = true;
				rainSplashSystem.emissionRate = Mathf.Floor(Mathf.Lerp(0,800,weather_RainAmt));
			#endif
		}

		if (fogSystem != null){
			#if UNITY_5_3 || UNITY_5_4 || UNITY_5_6 || UNITY_5_7 || UNITY_5_8 || UNITY_5_9
				fogEmission = fogSystem.emission;
				fogEmission.enabled = true;
				fogEmission.rate = ParticleSystem.MinMaxCurve(weather_FogAmt,Mathf.Lerp(2,1200,weather_FogAmt));
				if (fogSystem.particleCount <= 10){
					renderObjectFog.enabled = false;
				} else {
					renderObjectFog.enabled = true;
				}
				//add force
				fogForces = fogSystem.forceOverLifetime;
				fogForces.enabled = true;
				fogForces.x = ParticleSystem.MinMaxCurve(-weather_WindCoords.x * (weather_WindAmt*6));
				fogForces.y = ParticleSystem.MinMaxCurve(weather_WindCoords.y * (weather_WindAmt*6));
			#else
				fogSystem.enableEmission = true;
				renderObjectFog.enabled = true;
				fogSystem.emissionRate = Mathf.Floor(Mathf.Lerp(0,1200,weather_FogAmt));
			#endif
		}
		
		if (snowSystem != null){
			#if UNITY_5_3 || UNITY_5_4 || UNITY_5_6 || UNITY_5_7 || UNITY_5_8 || UNITY_5_9
				snowEmission = snowSystem.emission;
				snowEmission.enabled = true;
				snowEmission.rate = ParticleSystem.MinMaxCurve(weather_SnowAmt,Mathf.Lerp(2,5000,weather_SnowAmt));
				if (snowSystem.particleCount <= 10){
					renderObjectSnow.enabled = false;
				} else {
					renderObjectSnow.enabled = true;
				}
				//add force
				snowSystem.transform.localPosition.y = Mathf.Lerp(0.24,0.14,weather_WindAmt);
				snowForces = snowSystem.forceOverLifetime;
				snowForces.enabled = true;
				snowForces.x = ParticleSystem.MinMaxCurve(-weather_WindCoords.x * (weather_WindAmt*2));
				snowForces.y = ParticleSystem.MinMaxCurve(weather_WindCoords.y * (weather_WindAmt*2));
			#else
				snowSystem.enableEmission = true;
				renderObjectSnow.enabled = true;
				snowSystem.emissionRate = Mathf.Floor(Mathf.Lerp(0,2000,weather_SnowAmt));
			#endif

			//set system force (using 'weather_WindCoords')
			//not yet available, hopefully will be available in a Unity update
		}
	
	}

    /*
    //manage particle systems
	if (rainSystem != null){

		#if UNITY_5_3 || UNITY_5_4 || UNITY_5_6 || UNITY_5_7 || UNITY_5_8 || UNITY_5_9
			rainEmission = rainSystem.emission;
			if (weather_RainAmt <= 0.0) rainEmission.enabled = false;
			if (weather_RainAmt > 0.0) rainEmission.enabled = true;
			rainEmission.rate = ParticleSystem.MinMaxCurve(weather_RainAmt,5000.0);
		#else
			if (weather_RainAmt <= 0.0) rainSystem.enableEmission = false;
			if (weather_RainAmt > 0.0) rainSystem.enableEmission = true;
			rainSystem.emissionRate = Mathf.Floor(Mathf.Lerp(0,5000,weather_RainAmt));
		#endif
	}

	if (rainFogSystem != null){
		//if (weather_RainAmt <= 0.5) rainFogSystem.enableEmission = false;
		//if (weather_RainAmt > 0.5) rainFogSystem.enableEmission = true;
		//rainFogSystem.emissionRate = Mathf.Floor(Mathf.Lerp(0,800,Mathf.Clamp01((weather_RainAmt*-0.5)*2.0)));
		//rainFogSystem.emission.rate = Mathf.Floor(Mathf.Lerp(0,800,Mathf.Clamp01((weather_RainAmt*-0.5)*2.0)));
		//rainFogSystem.emission.rate = ParticleSystem.MinMaxCurve(weather_RainAmt,5000.0);
	}

	if (rainSplashSystem != null){

		#if UNITY_5_3 || UNITY_5_4 || UNITY_5_6 || UNITY_5_7 || UNITY_5_8 || UNITY_5_9
			splashEmission = rainSplashSystem.emission;
			if (weather_RainAmt <= 0.0) splashEmission.enabled = false;
			if (weather_RainAmt > 0.0) splashEmission.enabled = true;
			splashEmission.rate = ParticleSystem.MinMaxCurve(weather_RainAmt,800.0);
		#else
			if (weather_RainAmt <= 0.0) rainSplashSystem.enableEmission = false;
			if (weather_RainAmt > 0.0) rainSplashSystem.enableEmission = true;
			rainSplashSystem.emissionRate = Mathf.Floor(Mathf.Lerp(0,800,weather_RainAmt));
		#endif
	}

	if (fogSystem != null){

		#if UNITY_5_3 || UNITY_5_4 || UNITY_5_6 || UNITY_5_7 || UNITY_5_8 || UNITY_5_9
			fogEmission = fogSystem.emission;
			if (weather_FogAmt <= 0.0) fogEmission.enabled = false;
			if (weather_FogAmt > 0.0) fogEmission.enabled = true;
			fogEmission.rate = ParticleSystem.MinMaxCurve(weather_FogAmt,1200.0);
		#else
			if (weather_FogAmt <= 0.0) fogSystem.enableEmission = false;
			if (weather_FogAmt > 0.0) fogSystem.enableEmission = true;
			fogSystem.emissionRate = Mathf.Floor(Mathf.Lerp(0,1200,weather_FogAmt));
		#endif
	}
	
	if (snowSystem != null){

		#if UNITY_5_3 || UNITY_5_4 || UNITY_5_6 || UNITY_5_7 || UNITY_5_8 || UNITY_5_9
			snowEmission = snowSystem.emission;
			if (weather_SnowAmt <= 0.0) snowEmission.enabled = false;
			if (weather_SnowAmt > 0.0) snowEmission.enabled = true;
			snowEmission.rate = ParticleSystem.MinMaxCurve(weather_SnowAmt,2000.0);
		#else
			if (weather_SnowAmt <= 0.0) snowSystem.enableEmission = false;
			if (weather_SnowAmt > 0.0) snowSystem.enableEmission = true;
			snowSystem.emissionRate = Mathf.Floor(Mathf.Lerp(0,2000,weather_SnowAmt));
		#endif

		//set system force (using 'weather_WindCoords')
		//not yet available, hopefully will be available in a Unity update
	}
*/	


    //Overcast Calculations
    useOvercast = Mathf.Clamp(Mathf.Lerp(-1.0,1.0,weather_OvercastAmt),0.0,1.0);
	colorSkyBase = Color.Lerp(colorSkyBase,Color(0.3,0.4,0.5,1.0)*ambientCol.r,useOvercast);
	colorHorizon = Color.Lerp(colorHorizon,Color(0.7,0.8,0.9,1.0)*ambientCol.r,useOvercast);

	colorSkyBase = Color.Lerp(Color.Lerp(colorSkyBase*0.5,Color(0,0,0,1.0),0.6), colorSkyBase,solarSetInten); //total solar eclipse color
	colorHorizon = Color.Lerp(Color.Lerp(colorHorizon*0.8,Color(0,0,0,1.0),0.2), colorHorizon,solarSetInten);


	//apply color and lighting
	fxUseLight = Mathf.Clamp(4.0,0.1,0.8);
	lDiff = ((lightObjectWorld.intensity - 0.0)/0.68);
	lDiff += Mathf.Lerp(0.0,0.8,useOvercast);
	fxUseLight = Mathf.Lerp(0.0,lightObjectWorld.intensity,lDiff);

    rainCol = Color(0.65,0.75,0.75,1.0) * fxUseLight;
    if (renderObjectRainSplash) renderObjectRain.sharedMaterial.SetColor("_TintColor",Color(rainCol.r,rainCol.g,rainCol.b,0.12)*Mathf.Lerp(0.35,1.0,ambientCol.r));
	 
    splashCol = Color(1.0,1.0,1.0,1.0) * fxUseLight;
    if (renderObjectRainSplash) renderObjectRainSplash.sharedMaterial.SetColor("_TintColor",Color(splashCol.r,splashCol.g,splashCol.b,0.65));
    
    rainfogCol = Color(1.0,1.0,1.0,1.0) * fxUseLight;
   	rainfogFac = Mathf.Lerp(0.004,0.025,Mathf.Clamp01((weather_RainAmt-0.5)*2.0));	
    if (renderObjectRainFog) renderObjectRainFog.sharedMaterial.SetColor("_TintColor",Color(rainfogCol.r,rainfogCol.g,rainfogCol.b,rainfogFac));
    
    fogCol = Color.Lerp(Color(1,1,1,1),Color(1,1,1,1),0.6) * fxUseLight;
    fogFac = Mathf.Lerp(0.02,0.04,Mathf.Clamp01(weather_FogAmt));	
    if (renderObjectFog) renderObjectFog.sharedMaterial.SetColor("_TintColor",Color(fogCol.r,fogCol.g,fogCol.b,fogFac));
   
    snowCol = Color(0.85,0.85,0.85,1) * fxUseLight;
    if (renderObjectSnow) renderObjectSnow.sharedMaterial.SetColor("_TintColor",Color(snowCol.r,snowCol.g,snowCol.b,0.45));

    //clamp weather systems
    if (particleObjectRainFog && particleObjectRainFog.particleCount > 0.0) ClampParticle("rain fog");
	if (particleObjectRainSplash && particleObjectRainSplash.particleCount > 0.0) ClampParticle("rain splash");
	if (particleObjectFog && particleObjectFog.particleCount > 0.0) ClampParticle("fog");



    // --------------
    // --   FOG   ---   
    //---------------
    //if (overrideFog){
    //	RenderSettings.fog = false;
   // }  
	if (enableFog){
		Shader.SetGlobalFloat("_Tenkoku_FogStart",fogAtmosphere);
		Shader.SetGlobalFloat("_Tenkoku_FogEnd",fogDistance);
		Shader.SetGlobalFloat("_Tenkoku_FogDensity",fogDensity);

	    if (useCameraCam != null){
			Shader.SetGlobalFloat("_Tenkoku_shaderDepth",fogDistance/useCameraCam.farClipPlane);
		}


	} else {
		Shader.SetGlobalFloat("_Tenkoku_FogDensity",0.0);
	}

        

    // ------------------------
    // --   CLOUD SPHERES   ---   
    //-------------------------
    colorClouds = DecodeColorKey("colorcloud");  
    colorHighlightClouds = DecodeColorKey("ambientcloud");  
     
    colorHighlightClouds = Color.Lerp(colorHighlightClouds,Color(0.19,0.19,0.19,1.0),weather_OvercastAmt*2.0) * skyAmbientCol;

    colorClouds = Color.Lerp(colorClouds,colorClouds*colorOverlay,colorOverlay.a);
    colorHighlightClouds = Color.Lerp(colorHighlightClouds,colorHighlightClouds*colorOverlay,colorOverlay.a);


    timerCloudMod = 0.0;
    if (cloudLinkToTime){
    	if (!useAutoTime){
    		timerCloudMod = 0.0;
    	} else {
    		if (Application.isPlaying) timerCloudMod = useTimeCompression;
    	}
    } else {
    	timerCloudMod = 1.0; 
    }

	//calculate cloud rotation
	//cloudRotSpeed = weather_cloudSpeed * timerCloudMod;
    //cloudOverRot += (Time.deltaTime * cloudRotSpeed * 0.005);
	
	//cloudOverRot += Time.deltaTime*0.2;
	//if (cloudRotSpeed == weather_cloudSpeed) cloudOverRot = 1.0;
	//cloudRotSpeed = Mathf.Lerp(cloudRotSpeed,weather_cloudSpeed * timerCloudMod,cloudOverRot);

	cloudRotSpeed = weather_cloudSpeed * timerCloudMod;
    cloudOverRot += (Time.deltaTime * cloudRotSpeed * 0.005);

cloudOverRot = Mathf.Clamp(cloudOverRot,0.0,1.0);

  	//SET CLOUD SHADER SETTINGS
    if (renderObjectCloudPlane != null){
    	//cloudSpd = cloudOverRot;

    	//set wind/cloud speed
    	cloudSpeeds.r = 0.1 * cloudOverRot; //altostratus
		cloudSpeeds.g = 0.7 * cloudOverRot; //Cirrus
		cloudSpeeds.b = 1.0 * cloudOverRot; //cumulus
		cloudSpeeds.a = 1.1 * cloudOverRot; //overcast

		//cloudSpeeds = cloudOverRot;//cloudSpeeds * timerCloudMod;

    	renderObjectCloudPlane.sharedMaterial.SetColor("_cloudSpd",cloudSpeeds);
	   	//currCoords.x = currCoords.x+(Time.time*weather_cloudSpeed*weather_WindAmt*weather_WindCoords.x*0.0000008);
	   	//currCoords.y = currCoords.y+(Time.time*weather_cloudSpeed*weather_WindAmt*weather_WindCoords.y*0.0000008);
	   	currCoords.x = (currCoords.x+(Time.deltaTime*cloudRotSpeed*weather_WindCoords.x*0.08));
	   	currCoords.y = (currCoords.y+(Time.deltaTime*cloudRotSpeed*weather_WindCoords.y*0.08));

	   	//if (currCoords.x > 1.0) currCoords.x = (currCoords.x - 1.0);
	   	//if (currCoords.y > 1.0) currCoords.y = (currCoords.y - 1.0);
	   	
		Shader.SetGlobalColor("windCoords",Vector4(currCoords.x,currCoords.y,0,0));

   		renderObjectCloudPlane.sharedMaterial.SetFloat("_amtCloudS",weather_cloudAltoStratusAmt);
   		renderObjectCloudPlane.sharedMaterial.SetFloat("_amtCloudC",weather_cloudCirrusAmt);
   		renderObjectCloudPlane.sharedMaterial.SetFloat("_amtCloudO",Mathf.Clamp01(weather_OvercastAmt*2.0));

		renderObjectCloudPlane.sharedMaterial.SetFloat("_sizeCloud",weather_cloudCumulusAmt);
   		renderObjectCloudPlane.sharedMaterial.SetFloat("_cloudHeight",Mathf.Lerp(10.0,70.0,weather_cloudCumulusAmt));


		//set cloud scale
		if (useCameraCam != null){
			cloudSz = 1.0+(30000/2000.0); //30000 = useCameraCam.farClipPlane
			cloudPlaneObject.transform.localScale = Vector3(cloudSz,cloudSz,0.5);
			cloudSc = weather_cloudScale * (1.0+(30000/2000.0)) * 0.3;
		}

   		renderObjectCloudPlane.sharedMaterial.SetTextureScale("_MainTex",Vector2(cloudSc,cloudSc));
   		renderObjectCloudPlane.sharedMaterial.SetTextureScale("_CloudTexB",Vector2(cloudSc,cloudSc));
   	}

    

    // ------------------------
    // --   CLOUD OBJECTS   ---   
    //-------------------------
    if (cloudLinkToTime){
    	if (!useAutoTime){
    		timerCloudMod = 0.0;
    	} else {
    		timerCloudMod = useTimeCompression;
    	}

    } else {
    	timerCloudMod = 1.0;
    }
    setCloudFog1 = colorSkyBase*1.1;
    setCloudFog1.a = 1.0;
    setCloudFog1.r *= 0.65;
    setCloudFog1.g *= 0.8;

	colorHorizon = Color.Lerp(colorHorizon,colorHorizon*0.5,weather_OvercastAmt);
	setCloudBase = Color.Lerp(colorHorizon*1.8,colorHorizon*0.4,weather_OvercastAmt);
	setCloudTint = Color.Lerp(colorSkyBase*0.8,colorSkyBase*0.2,weather_OvercastAmt*3.0);
    setCloudFog1 = Color.Lerp(setCloudFog1,Color(0.5,0.5,0.5,1.0),weather_OvercastAmt);



	
	// -------------------------------
    // --   Set Global Tint Color   --
    // -------------------------------
    Shader.SetGlobalColor("_TenkokuSkyColor",DecodeColorKey("skybase"));
    Shader.SetGlobalColor("tenkoku_globalTintColor",colorOverlay);
    Shader.SetGlobalColor("tenkoku_globalSkyColor",colorSky);

 	// -------------------------------
    // --   Altitude Adjustment   --
    // -------------------------------
    // adjust colors and alpha based on altitude height attributes.
    // can simulate entering and leaving planet atmosphere;
    altAdjust = 5000.0;//this.transform.position.y;
    Shader.SetGlobalFloat("tenkoku_altitudeAdjust",altAdjust);
    
    
	// -------------------------
    // --   BRDF Sky Object   --
    // -------------------------
    if (useCamera != null){
    if (useCameraCam != null){
    	fogDist = (1.0/useCameraCam.farClipPlane)*(0.9 + fogDistance);
    	fogFull = useCameraCam.farClipPlane;//(1.0/useCameraCam.farClipPlane)*(0.9 + 0.0015);
    }
	}
	skyAmbientCol = ambientCol * Mathf.Lerp(1.0,0.7,useOvercast);
	skyHorizonCol = colorHorizon * Mathf.Lerp(1.0,0.8,useOvercast);

	Shader.SetGlobalColor("_Tenkoku_SkyHorizonColor",skyHorizonCol);

	Shader.SetGlobalFloat("_tenkokufogFull",floatRound(fogFull));
	Shader.SetGlobalFloat("_tenkokufogStretch",floatRound(fogDist));
	Shader.SetGlobalFloat("_tenkokufogAtmospheric",floatRound(fogAtmosphere));
	Shader.SetGlobalFloat("_Tenkoku_SkyBright",floatRound(useSkyBright));
	Shader.SetGlobalFloat("_Tenkoku_NightBright",floatRound(nightBrightness));
	Shader.SetGlobalColor("_TenkokuAmbientColor",skyAmbientCol);
	Shader.SetGlobalColor("_TenkokuSunColor",DecodeColorKey("sun"));

	Shader.SetGlobalFloat("_Tenkoku_AtmosphereDensity",floatRound(atmosphereDensity));
	if (enableFog){
		Shader.SetGlobalFloat("_Tenkoku_FogDensity",floatRound(fogDensity));
	}

	//overcast color
	overcastCol = DecodeColorKey("ambientcolor");//Color(0.1,0.1,0.1,1.0)*DecodeColorKey("ambientcolor");
	overcastCol.a = weather_OvercastAmt;
	Shader.SetGlobalColor("_Tenkoku_overcastColor",overcastCol);



    // assign colors
    if (useCamera != null){
	    if (useCameraCam != null){
	    	useCameraCam.backgroundColor = DecodeColorKey("skybase")*Color.Lerp(Color(1,1,1,1),Color(0,0,0,1),atmosphereDensity*0.25);//skyHorizonCol;
	    	useCameraCam.backgroundColor = Color.Lerp(Color(0,0,0,1),useCameraCam.backgroundColor,Mathf.Clamp(atmosphereDensity*2,0.0,1.0));
	    	useCameraCam.backgroundColor *= Mathf.Clamp(skyBrightness,0.0,1.0);
		}
	    nightSkyLightObject.transform.eulerAngles = useCamera.transform.eulerAngles;
	    nightSkyLightObject.transform.eulerAngles.x = 60.0;
	}

    if (fogCameraCam != null){
    	fogCameraCam.backgroundColor = DecodeColorKey("skybase")*Color.Lerp(Color(1,1,1,1),Color(0,0,0,1),atmosphereDensity*0.25);//skyHorizonCol;
    	fogCameraCam.backgroundColor = Color.Lerp(Color(0,0,0,1),fogCameraCam.backgroundColor,Mathf.Clamp(atmosphereDensity*2,0.0,1.0));
    	fogCameraCam.backgroundColor *= Mathf.Clamp(skyBrightness,0.0,1.0);

		// OVER CAST FOG BLURRING
		if (weather_OvercastAmt != currWeather_OvercastAmt){
			currWeather_OvercastAmt = weather_OvercastAmt;
			fogVals = Mathf.Floor(Mathf.Lerp(3.0,6.0,weather_OvercastAmt)).ToString();
			fogVals += ","+Mathf.Lerp(0.1,2.0,weather_OvercastAmt).ToString();
			fogCameraCam.SendMessage("SetFogValues",fogVals,SendMessageOptions.DontRequireReceiver);
		}
	}


	if (RenderSettings.skybox != null){
		RenderSettings.skybox.SetFloat("_TenkokuColorFac",Mathf.Lerp(1.0,0.0,weather_OvercastAmt));
		RenderSettings.skybox.SetFloat("_TenkokuExposureFac",Mathf.Lerp(1.0,0.5,weather_OvercastAmt));
		RenderSettings.skybox.SetColor("_GroundColor",colorSkyboxGround);
		
	} else {
		Debug.Log("Tenkoku Warning: No Skybox material has been set!");
	}



    setOverallCol = colorSun*ambientCol*Color.Lerp(Color(1,1,1,1),colorOverlay,colorOverlay.a);
	Shader.SetGlobalColor("_overallCol",setOverallCol);

	bgSCol = skyHorizonCol;//colorSkyBase;//bgCol;
    // convert camera color to linear space when appropriate
    // the scene camera does not render background colors in linear space, so we need to
    // convert the background color to linear before assigning to in-scene shaders.
    if (QualitySettings.activeColorSpace == ColorSpace.Linear){
	    bgSCol.r = Mathf.GammaToLinearSpace(bgSCol.r);
	    bgSCol.g = Mathf.GammaToLinearSpace(bgSCol.g);
	    bgSCol.b = Mathf.GammaToLinearSpace(bgSCol.b);
	}
	Shader.SetGlobalColor("tenkoku_backgroundColor",bgSCol);

	
	//handle gamma brightness
	useSkyBright = skyBrightness;
	if (QualitySettings.activeColorSpace != ColorSpace.Linear){
		useSkyBright *= 0.42;
	}

	//assign blur settings
    if (fogCameraBlur != null){
		fogCameraBlur.iterations = fogDisperse;
		fogCameraBlur.blurSpread = 0.1;
	}



	// ------------------------
    // --   Cloud Objects   --
    // ------------------------
    Shader.SetGlobalColor("_TenkokuCloudColor",colorClouds);
    Shader.SetGlobalColor("_TenkokuCloudHighlightColor",colorHighlightClouds);

	//set cloud effect distance color
	Shader.SetGlobalFloat("_fogStretch",floatRound(fogDist));
	Shader.SetGlobalColor("_Tenkoku_SkyColor",colorSkyBase*ambientCloudCol.r*setOverallCol*useSkyBright);
	Shader.SetGlobalColor("_Tenkoku_HorizonColor",colorHorizon*setOverallCol*useSkyBright);
	Shader.SetGlobalFloat("_Tenkoku_Ambient",ambientCloudCol.r);

	
	

	//set GI Ambient
	ambientGI = DecodeColorKey("ambientGI");
	Shader.SetGlobalFloat("_Tenkoku_AmbientGI",ambientGI.r);


	//if (position == "ambientcolor") texPos = 81;
	//if (position == "skyambient") texPos = 37;
	//if (position == "ambientcloud") texPos = 186;
	//if (position == "ambientGI") texPos = 15;
	//ambientGI = DecodeColorKey("skyambient");
	//Shader.SetGlobalFloat("_Tenkoku_AmbientGI",ambientGI.r);

	//set aurora settings
	auroraIsVisible = false;
	if (auroraTypeIndex == 0){
		auroraIsVisible = true;
	}

	
	if (!auroraIsVisible || auroraLatitude > Mathf.Abs(setLatitude)){
		renderObjectAurora.enabled = false;
	} else {
	 	renderObjectAurora.enabled = true;
	 	
	 	aurSpan = 30.0;
	 	aurAmt = Mathf.Lerp(0.0,1.0,Mathf.Clamp((Mathf.Abs(setLatitude)-auroraLatitude)/aurSpan,0.0,1.0));
	 	//aurPos = Mathf.Lerp(1.0,0.0,Mathf.Clamp((Mathf.Abs(setLatitude)-auroraLatitude)/(90.0-auroraLatitude),0.0,1.0));

	 	Shader.SetGlobalFloat("_Tenkoku_AuroraSpd",auroraSpeed);
		Shader.SetGlobalFloat("_Tenkoku_AuroraAmt",auroraIntensity*aurAmt);	
	}
	



    // ------------------------------
    // --   HANDLE IMAGE EFFECTS   --
    // ------------------------------
    if (useCamera != null){

		lightVals = sunlightObject.transform.name;
		lightVals += ","+lightObjectWorld.color.r.ToString();
		lightVals += ","+lightObjectWorld.color.g.ToString();
		lightVals += ","+lightObjectWorld.color.b.ToString();

		setSun = "1";
		if (!useSunRays) setSun = "0";
		lightVals += ","+setSun;
		lightVals += ","+Mathf.Lerp(0.0,20.0,sunRayIntensity).ToString("00");

		useCamera.SendMessage("SetLightValues",lightVals,SendMessageOptions.DontRequireReceiver);
    }
   

    
    // ----------------------------
    // --   WORLD LIGHT OBJECT   --
    // ----------------------------
 	worldlightObject.transform.rotation = sunlightObject.transform.rotation;
 	WorldCol = Color.Lerp(DecodeColorKey("sun") * ambientCol.r, Color(ambientCol.r,ambientCol.r,ambientCol.r,1)*0.4,Mathf.Clamp01(weather_OvercastAmt*5));

	//tint light color with overall color
	 WorldCol = WorldCol * Color.Lerp(Color(1.0,1.0,1.0,1.0),colorOverlay,colorOverlay.a);


 	lightObjectWorld.color = WorldCol;
    lightObjectWorld.intensity = 2.0 * (sunBright*0.68) * ambientCol.r;   
	lightObjectWorld.intensity *= Mathf.Lerp(1.0,0.2,useOvercast);

   	lightObjectWorld.shadowStrength = Mathf.Lerp(0.15,1.0,1.0*(1.0-weather_OvercastAmt));
    

    // ----------------------------
    // --   NIGHT LIGHT OBJECT   --
    // ----------------------------
 	nightSkyLightObject.transform.rotation = moonlightObject.transform.rotation;
    lightObjectNight.intensity = Mathf.Lerp(0.0,1.0,(nightBrightness)*1.2*(1.0-ambientCol.r))+(moonBright*(1.0-ambientCol.r))* (1.0-weather_OvercastAmt);
	lightObjectNight.color = Color(0.25,0.33,0.36,1.0);


    // ---------------------------------
	// --   SOLAR ECLIPSE HANDLING   ---
	// ---------------------------------
	lightObjectWorld.intensity *= Mathf.Lerp(0.3,1.0,solarSetInten);
	Shader.SetGlobalFloat("tenkoku_eclipsefac",Mathf.Clamp(solarSetInten*2,0.0,1.0));


	//handle gamma world lighting brightness
	if (QualitySettings.activeColorSpace != ColorSpace.Linear){
		lightObjectWorld.intensity = lightObjectWorld.intensity*0.8;
	}

	//set minimum world light setting
	lightObjectWorld.intensity = Mathf.Clamp(lightObjectWorld.intensity,0.001,8.0);

}






function FixedUpdate(){
	TimeUpdate();
}


function TimeUpdate(){

    //------------------------------
    //---    CALCULATE TIMER    ----
    //------------------------------


	//TRANSITION TIME
	if (doTransition){
		Tenkoku_TransitionTime();
	}



	//AUTO INCREASE TIME
	if (useAutoTime && !autoTimeSync && Application.isPlaying){

		//calculate time compression curve
		curveVal = timeCurves.Evaluate(dayValue);
	
		if (useTimeCompression < 3600.0){
			setTimeSpan = (Time.fixedDeltaTime * useTimeCompression);
			countSecond += setTimeSpan;
			countSecondMoon += Mathf.Floor(setTimeSpan*0.92068);
			countSecondStar += Mathf.Floor(setTimeSpan*0.9333342);
		} else {
			setTimeSpan = (Time.fixedDeltaTime * (useTimeCompression/60.0));
			countMinute += setTimeSpan;
			countMinuteMoon += Mathf.Floor(setTimeSpan*0.92068);
			countMinuteStar += Mathf.Floor(setTimeSpan*0.9333342);
		}
	}
	


	if (Mathf.Abs(countSecond) >= 1.0){
		currentSecond += Mathf.Floor(countSecond);
		countSecond = 0.0;
	}
	if (Mathf.Abs(countMinute) >= 1.0){
		currentMinute += Mathf.Floor(countMinute);
		countMinute = 0.0;
	}
		
	if (Mathf.Abs(countSecondMoon) >= 1.0){
		moonSecond += Mathf.Floor(countSecondMoon);
		countSecondMoon = 0.0;
	}
	if (Mathf.Abs(countMinuteMoon) >= 1.0){
		moonMinute += Mathf.Floor(countMinuteMoon);
		countMinuteMoon = 0.0;
	}
		
	if (Mathf.Abs(countSecondStar) >= 1.0){
		starSecond += Mathf.Floor(countSecondStar);
		countSecondStar = 0.0;
	}
	if (Mathf.Abs(countMinuteStar) >= 1.0){
		starMinute += Mathf.Floor(countMinuteStar);
		countMinuteStar = 0.0;
	}
		
		
	//RECALCULATE DATE and TIME
	RecalculateTime();
	
	//SET DISPLAY TIME
	displayTime = DisplayTime("[ hh:mm:ss am] [ M/D/Y ad]");





//}
}





function DisplayTime( format : String ){

	//format string examples:
	// "M/D/Y H:M:S"
	setString = format;
	eon = "ad";
	useHour = setHour;
	
	displayHour = setHour;
	if (use24Clock){
		hourMode = "AM";
		if (useHour > 12){
			displayHour -= 12;
			hourMode = "PM";
		}
	} else {
		hourMode = "";
	}

	
	if (currentYear < 0) eon = "bc";
	setString = setString.Replace("hh",useHour.ToString("00"));
	setString = setString.Replace("mm",currentMinute.ToString("00"));
	setString = setString.Replace("ss",currentSecond.ToString("00"));
	setString = setString.Replace("Y",Mathf.Abs(currentYear).ToString());
	setString = setString.Replace("M",currentMonth.ToString());
	setString = setString.Replace("D",currentDay.ToString());
	setString = setString.Replace("ad",eon.ToString());
	
	if (use24Clock){
		setString = setString.Replace("am",hourMode.ToString());
	} else {
		setString = setString.Replace("am","");
	}
	
	
	return setString;
}





function RecalculateLeapYear( checkMonth:int, checkYear:int){

	//check for leap Year (by div 4 method)
	leapYear = false;
	if ( (checkYear / 4.0) == Mathf.Floor(checkYear / 4.0) ) leapYear = true;

	//double check for leap Year (by div 100 + div 400 method)
	if ((checkYear / 100.0) == Mathf.Floor(checkYear / 100.0)){
		if ((checkYear / 400.0) != Mathf.Floor(checkYear / 400.0)) leapYear = false;
	}
	
	//calculate month length
	monthLength = 31;
	testMonth = Mathf.Floor(checkMonth);
	if (testMonth == 4 || testMonth == 6 || testMonth == 9 || testMonth == 11) monthLength = 30;
	if (testMonth == 2 && !leapYear) monthLength = 28;
	if (testMonth == 2 && leapYear) monthLength = 29;

	return monthLength;
	
}




function RecalculateTime(){
	
	//getLeapYear
	monthFac = RecalculateLeapYear(currentMonth,currentYear);

	//clamp and pass all values
	if (currentSecond > 59 || currentSecond < 0) currentMinute += Mathf.Floor(currentSecond/60.0);
	if (currentSecond > 59) currentSecond = 0;
	if (currentSecond < 0) currentSecond = 59;
	if (currentMinute > 59 || currentMinute < 0.0) currentHour += Mathf.Floor(currentMinute/60.0);
	if (currentMinute > 59) currentMinute = 0;
	if (currentMinute < 0) currentMinute = 59;

	if (currentHour > 23 || currentHour < 0) currentDay += Mathf.Ceil((currentHour/24.0));
	if (currentHour > 23) currentHour = 0;
	if (currentHour < 0) currentHour = 23;

	if (currentDay > monthFac || currentDay < 1) currentMonth += Mathf.Ceil((currentDay/(monthFac*1.0))-1.0);
	if (currentDay > monthFac) currentDay = 1;
	if (currentDay < 1) currentDay = RecalculateLeapYear(currentMonth-1,currentYear);
	if (currentMonth > 12 || currentMonth < 1) currentYear += Mathf.Ceil((currentMonth/12.0)-1);
	if (currentMonth > 12) currentMonth = 1;
	if (currentMonth < 1) currentMonth = 12;
	if (currentYear == 0) currentYear = 1;
	
	//clamp and pass all moon values
	if (moonSecond > 59 || moonSecond < 0) moonMinute += Mathf.Floor(moonSecond/60.0);
	if (moonSecond > 59) moonSecond = 0;
	if (moonSecond < 0) moonSecond = 59;
	if (moonMinute > 59 || moonMinute < 0.0) moonHour += Mathf.Floor(moonMinute/60.0);
	if (moonMinute > 59) moonMinute = 0;
	if (moonMinute < 0) moonMinute = 59;
	if (moonHour > 24 || moonHour < 1) moonDay += Mathf.Ceil((moonHour/24.0)-1);
	if (moonHour > 24) moonHour = 1;
	if (moonHour < 1) moonHour = 24;
	if (moonDay > monthFac || moonDay < 1) moonMonth += Mathf.Ceil((moonDay/(monthFac*1.0))-1.0);
	if (moonDay > monthFac) moonDay = 1;
	if (moonDay < 1) moonDay = RecalculateLeapYear(moonMonth-1,currentYear);
	if (moonMonth > 12 || moonMonth < 1) moonYear += Mathf.Ceil((moonMonth/12.0)-1);
	if (moonMonth > 12) moonMonth = 1;
	if (moonMonth < 1) moonMonth = 12;
	
	//clamp and pass all star values
	if (starSecond > 59 || starSecond < 0) starMinute += Mathf.Floor(starSecond/60.0);
	if (starSecond > 59) starSecond = 0;
	if (starSecond < 0) starSecond = 59;
	if (starMinute > 59 || starMinute < 0.0) starHour += Mathf.Floor(starMinute/60.0);
	if (starMinute > 59) starMinute = 0;
	if (starMinute < 0) starMinute = 59;
	if (starHour > 24 || starHour < 1) starDay += Mathf.Ceil((starHour/24.0)-1);
	if (starHour > 24) starHour = 1;
	if (starHour < 1) starHour = 24;
	if (starDay > monthFac || starDay < 1) starMonth += Mathf.Ceil((starDay/(monthFac*1.0))-1.0);
	if (starDay > monthFac) starDay = 1;
	if (starDay < 1) starDay = RecalculateLeapYear(starMonth-1,currentYear);
	if (starMonth > 12 || starMonth < 1) starYear += Mathf.Ceil((starMonth/12.0)-1);
	if (starMonth > 12) starMonth = 1;
	if (starMonth < 1) starMonth = 12;
	
	
	if (!use24Clock && setHour > 12){
		setHour = currentHour + 12;
	} else {
		setHour = currentHour;
	}
	setHour = currentHour;




	//CALCULATE TIMERS
	setDay = ((setHour-1) * 3600.0) + (currentMinute * 60.0) + (currentSecond * 1.0);
	setStar = ((starHour-1) * 3600.0) + (starMinute * 60.0) + (starSecond * 1.0);
	monthAddition = 0.0;

	for (aM = 1.0; aM < currentMonth; aM++){
		monthAddition += RecalculateLeapYear( aM, currentYear);
	}
	setYear = monthAddition+(currentDay-1)+((currentSecond + (currentMinute*60) + (setHour*3600))/86400.0);
	setMonth = (Mathf.Floor(moonDay-1)*86400.0) + (Mathf.Floor(moonHour-1) * 3600.0) + (Mathf.Floor(moonMinute) * 60.0) + (Mathf.Floor(moonSecond) * 1.0);
	setMoon = (Mathf.Floor(moonDay-1)*86400.0)+(Mathf.Floor(moonHour-1) * 3600.0) + (Mathf.Floor(moonMinute) * 60.0) + (Mathf.Floor(moonSecond) * 1.0);
	setStar = (Mathf.Floor(starMonth-1)*30.41666)+Mathf.Floor(starDay-1)+(Mathf.Floor((starSecond) + (Mathf.Floor(starMinute)*60) + (Mathf.Floor(starHour-1)*3600))/86400.0);


	//CLAMP VALUES
	yearDiv = 365.0;
	if (leapYear) yearDiv = 366.0;
	if (setYear > (86400.0 *  yearDiv)) setYear = 0.0;
	if (setYear < 0.0) setYear = (86400.0 *  yearDiv);
	

	//CALCULATE VALUES
	dayValue = setDay / 86400.0;
	monthValue = setMonth / (86400.0 * 29.530589);
	yearValue = setYear / yearDiv;
	starValue = setDay / 86400.0;
	starValue -= (setStar / 365.0);
	moonValue = setDay / 86400.0;
	moonValue -= setMoon / ((86400.0) * 29.6666);
	
	//SEND TIME TO CALCULATIONS COMPONENT
	calcComponent.y = currentYear;
	calcComponent.m = currentMonth;
	calcComponent.D = currentDay;
	calcComponent.UT = 1.0*currentHour+(1.0*currentMinute/60.0)+((1.0*currentSecond/60.0)/60.0);


	calcComponent.local_latitude = setLatitude;
	calcComponent.local_longitude = setLongitude;	
}



function floatRound(inFloat : float){
	//var retFloat : float = 0.0;
	//retFloat = Mathf.Round(inFloat*1000.0)/1000.0;
	//return retFloat;
	return inFloat;
}





function ClampParticle( px_system : String){

	clampRes = 0.0;
	px = 0;
	usePoint = 0.0;
	
	//clamp rain fog particles to ground (raycast)
	if (px_system == "rain fog"){
	clampRes = 1.0;
	setParticles = new ParticleSystem.Particle[particleObjectRainFog.particleCount];
	particleObjectRainFog.GetParticles(setParticles);
	for (px = 0; px < particleObjectRainFog.particleCount; px++){
		if (setParticles[px].remainingLifetime >= 2.5){
			if ((px/clampRes) == (Mathf.Floor(px/clampRes))*1.0){
			if (Physics.Raycast(Vector3(setParticles[px].position.x,5000.0,setParticles[px].position.z), -Vector3.up, hit, 10000.0)){
				usePoint = hit.point.y;
			}	
			}
			setParticles[px].position.y = usePoint;
		}
	}
	particleObjectRainFog.SetParticles(setParticles,setParticles.length);
	particleObjectRainFog.Play();
	}

	
	
    
	//clamp rain fog particles to ground (raycast)
	if (px_system == "rain splash"){
	clampRes = 1.0;
	setParticles = new ParticleSystem.Particle[particleObjectRainSplash.particleCount];
	particleObjectRainSplash.GetParticles(setParticles);
	for (px = 0; px < particleObjectRainSplash.particleCount; px++){
		
		#if UNITY_5_3 || UNITY_5_4 || UNITY_5_6 || UNITY_5_7 || UNITY_5_8 || UNITY_5_9
			setParticles[px].startColor.a = 0.0;
		#else
			setParticles[px].color.a = 0.0;
		#endif

		if (setParticles[px].remainingLifetime >= 0.05){
			if ((px/clampRes) == (Mathf.Floor(px/clampRes))*1.0){
			if (Physics.Raycast(Vector3(setParticles[px].position.x,5000.0,setParticles[px].position.z), -Vector3.up, hit, 10000.0)){
				usePoint = hit.point.y;
			}
			}
			setParticles[px].position.y = usePoint;

			#if UNITY_5_3 || UNITY_5_4 || UNITY_5_6 || UNITY_5_7 || UNITY_5_8 || UNITY_5_9
				setParticles[px].startColor.a = TenRandom.Range(25.0,150.0);;
			#else
				setParticles[px].color.a = TenRandom.Range(25.0,150.0);
			#endif
		}
	}
	particleObjectRainSplash.SetParticles(setParticles,setParticles.length);
	particleObjectRainSplash.Play();
	}


	//clamp fog particles to ground (raycast)
	if (px_system == "fog"){
	clampRes = 1.0;
	setParticles = new ParticleSystem.Particle[particleObjectFog.particleCount];
	particleObjectFog.GetParticles(setParticles);
	for (px = 0; px < particleObjectFog.particleCount; px++){
		if (setParticles[px].remainingLifetime >= 4.8){
			if ((px/clampRes) == (Mathf.Floor(px/clampRes))*1.0){
			if (Physics.Raycast(Vector3(setParticles[px].position.x,5000.0,setParticles[px].position.z), -Vector3.up, hit, 10000.0)){
				usePoint = hit.point.y;
			}	
			}
			if (usePoint > weather_FogHeight) usePoint = weather_FogHeight;
			setParticles[px].position.y = usePoint;
		}
	}
	particleObjectFog.SetParticles(setParticles,setParticles.length);
	particleObjectFog.Play();
	}
	
	
	
}



function TenkokuConvertAngleToVector(convertAngle : float) : Vector2{

	dir = Vector3(0,0);
	tempAngle = Vector3(0,0,0);
	if (convertAngle <= 180.0){
		tempAngle = Vector3.Slerp(Vector3.forward,-Vector3.forward,(convertAngle)/180.0);
		dir = Vector2(tempAngle.x,tempAngle.z);
	}
	if (convertAngle > 180.0){
		tempAngle = Vector3.Slerp(-Vector3.forward,Vector3.forward,(convertAngle-180.0)/180.0);
		dir = Vector2(-tempAngle.x,tempAngle.z);
	}
	
	return dir;
}



function DecodeColorKey(position : String) : Color{

	//positions
	texPos = 0;
	if (position == "sun") texPos = 144;
	if (position == "ambientcolor") texPos = 81;
	if (position == "moon") texPos = 59;
	if (position == "skyambient") texPos = 37;
	if (position == "skybase") texPos = 100;
	if (position == "ambientcloud") texPos = 186;
	if (position == "colorhorizon") texPos = 121;
	if (position == "colorcloud") texPos = 166;
	if (position == "ambientGI") texPos = 15;
	
	//decode texture
	returnColor = Color(0,0,0,1);
	if (colorRamp != null){
		returnColor = Color.Lerp((colorRamp.GetPixel(stepTime, texPos)),(colorRamp.GetPixel(stepTime+1, texPos)), timeLerp);
	}
	
	if (position == "moon" && colorRamp != null){
		returnColor = Color.Lerp((colorRamp.GetPixel(stepTimeM, texPos)),(colorRamp.GetPixel(stepTimeM+1, texPos)), timeLerpM);
	}

	//modulate colors based on atmospheric density
	if (position == "sun"){
		returnColor = Color.Lerp(Color(1,1,1,1),returnColor,atmosphereDensity);
		returnColor = Color.Lerp(returnColor,Color(0.5,0.1,0,1),atmosphereDensity*0.3);
		returnColor = Color.Lerp(returnColor,Color(0.0,0.0,0,1),atmosphereDensity*0.1);
	}


	//linear and gamma conversion
	if (QualitySettings.activeColorSpace != ColorSpace.Linear){
		//returnColor.r =  Mathf.GammaToLinearSpace(returnColor.r);
		//returnColor.g =  Mathf.GammaToLinearSpace(returnColor.g);
		//returnColor.b =  Mathf.GammaToLinearSpace(returnColor.b);
		//returnColor.a =  Mathf.GammaToLinearSpace(returnColor.a);

		//specific color shift
		if (position == "skybase"){
			returnColor.r *= 0.4646;
			returnColor.g *= 0.4646;
			returnColor.b *= 0.4646;
			//returnColor.r *= 1.1;
			//returnColor.g *= 0.85;
			//returnColor.b *= 1.15;
			//returnColor = Color.Lerp(returnColor,Color(0.88,0.88,0.88,1),0.1);
		}	
	}
	
	return returnColor;	    
}



// SET TENKOKU DATA
//the SetData functio is useful in accessing
//tenkoku weather and time variables from C#
//components.  Please see documentation for
//more information on usage.
function Tenkoku_SetData( data : String){

	//split
    dataArray = data.Split(","[0]);

	for (ax = 0; ax < (dataArray.length); ax++){

		//get positions
		for (xP = 0; xP < dataArray[ax].length; xP++){
			if (dataArray[ax].Substring(xP,1) == "(") pos1 = xP;
			if (dataArray[ax].Substring(xP,1) == ")") pos2 = xP;
		}

		//decode data
		length = pos2-(pos1+1);
		func = dataArray[ax].Substring(0,pos1).ToLower();
		dat = dataArray[ax].Substring(pos1+1,length);

		//run functions
		if (func=="currentyear") currentYear = int.Parse(dat);
		if (func=="currentmonth") currentMonth = int.Parse(dat);
		if (func=="currentday") currentDay = int.Parse(dat);
		if (func=="currenthour") currentHour = int.Parse(dat);
		if (func=="currentminute") currentMinute = int.Parse(dat);
		if (func=="currentsecond") currentSecond = int.Parse(dat);

		if (func=="setlatitude") setLatitude = float.Parse(dat);
		if (func=="setlongitude") setLongitude = float.Parse(dat);

		if (func=="weather_cloudaltostratusamt") weather_cloudAltoStratusAmt = float.Parse(dat);
		if (func=="weather_cloudcirrusamt") weather_cloudCirrusAmt = float.Parse(dat);
		if (func=="weather_cloudcumulusamt") weather_cloudCumulusAmt = float.Parse(dat);
		if (func=="weather_overcastamt") weather_OvercastAmt = float.Parse(dat);
		if (func=="weather_cloudscale") weather_cloudScale = float.Parse(dat);
		if (func=="weather_cloudspeed") weather_cloudSpeed = float.Parse(dat);
		if (func=="weather_rainamt") weather_RainAmt = float.Parse(dat);
		if (func=="weather_snowamt") weather_SnowAmt = float.Parse(dat);
		if (func=="weather_fogamt") weather_FogAmt = float.Parse(dat);
		if (func=="weather_windamt") weather_WindAmt = float.Parse(dat);
		if (func=="weather_winddir") weather_WindDir = float.Parse(dat);

		if (func=="weathertypeindex") weatherTypeIndex = int.Parse(dat);
		if (func=="weather_autoforecasttime") weather_autoForecastTime = float.Parse(dat);
		if (func=="weather_transitiontime") weather_TransitionTime = float.Parse(dat);
		if (func=="weather_forceupdate") weather_forceUpdate = true;


		var setSync : boolean = false;
		if (func=="autotimesync"){ 
			if (float.Parse(dat) == 1.0) setSync = true;
			if (dat == "true") setSync = true;
			autoTimeSync = setSync;
		}
		setSync = false;
		if (func=="autodatesync"){ 
			if (float.Parse(dat) == 1.0) setSync = true;
			if (dat == "true") setSync = true;
			autoDateSync = setSync;
		}
		setSync = false;
		if (func=="autotime"){ 
			if (float.Parse(dat) == 1.0) setSync = true;
			if (dat == "true") setSync = true;
			autoTime = setSync;
		}

		if (func=="timecompression") timeCompression = float.Parse(dat);

		if (func=="maincamera"){
			if (GameObject.Find(dat) != null){
				mainCamera = GameObject.Find(dat).transform; 
			}
		}


	}


}







// ENCODE SETTINGS TO STRING
// this is useful to quickly encode
// Tenkoku settings over a server.
function Tenkoku_EncodeData() : String{

	//run functions
	dataString = currentYear.ToString()+",";
	dataString += currentMonth.ToString()+",";
	dataString += currentDay.ToString()+",";
	dataString += currentHour.ToString()+",";
	dataString += currentMinute.ToString()+",";
	dataString += currentSecond.ToString()+",";

	dataString += setLatitude.ToString()+",";
	dataString += setLongitude.ToString()+",";

	dataString += weather_cloudAltoStratusAmt.ToString()+",";
	dataString += weather_cloudCirrusAmt.ToString()+",";
	dataString += weather_cloudCumulusAmt.ToString()+",";
	dataString += weather_OvercastAmt.ToString()+",";
	dataString += weather_cloudScale.ToString()+",";
	dataString += weather_cloudSpeed.ToString()+",";
	dataString += weather_RainAmt.ToString()+",";
	dataString += weather_SnowAmt.ToString()+",";
	dataString += weather_FogAmt.ToString()+",";
	dataString += weather_WindAmt.ToString()+",";
	dataString += weather_WindDir.ToString()+",";

	dataString += weatherTypeIndex.ToString()+",";
	dataString += weather_autoForecastTime.ToString()+",";
	dataString += weather_TransitionTime.ToString()+",";

	if (weather_forceUpdate) dataUpdate = "1";
	dataString += dataUpdate;

	return dataString;
}





// DECODE SETTINGS FROM STRING
// this is useful to quickly decode
// Tenkoku settings over a server.
function Tenkoku_DecodeData( dataString : String ){

    data = dataString.Split(","[0]);

    //set functions
	currentYear = int.Parse(data[0]);
	currentMonth = int.Parse(data[1]);
	currentDay = int.Parse(data[2]);
	currentHour = int.Parse(data[3]);
	currentMinute = int.Parse(data[4]);
	currentSecond = int.Parse(data[5]);

	setLatitude = float.Parse(data[6]);
	setLongitude = float.Parse(data[7]);

	weather_cloudAltoStratusAmt = float.Parse(data[8]);
	weather_cloudCirrusAmt = float.Parse(data[9]);
	weather_cloudCumulusAmt = float.Parse(data[10]);
	weather_OvercastAmt = float.Parse(data[11]);
	weather_cloudScale = float.Parse(data[12]);
	weather_cloudSpeed = float.Parse(data[13]);
	weather_RainAmt = float.Parse(data[14]);
	weather_SnowAmt = float.Parse(data[15]);
	weather_FogAmt = float.Parse(data[16]);
	weather_WindAmt = float.Parse(data[17]);
	weather_WindDir = float.Parse(data[18]);

	weatherTypeIndex = int.Parse(data[19]);
	weather_autoForecastTime = float.Parse(data[20]);
	weather_TransitionTime = float.Parse(data[21]);

	setUpdate = data[22];
	if (setUpdate == "1") weather_forceUpdate = true;

}








// TRANSITION TIME CAPTURE (JAVACRIPT)
function Tenkoku_SetTransition(startTime : String, targetTime : String, duration : int, direction : float){
	transitionStartTime = startTime;
	transitionTargetTime = targetTime;
	transitionDuration = duration;
	transitionDirection = direction;
	doTransition = true;
}
function Tenkoku_SetTransition(startTime : String, targetTime : String, duration : int, direction : float, callbackObject : GameObject){
	transitionStartTime = startTime;
	transitionTargetTime = targetTime;
	transitionDuration = duration;
	transitionDirection = direction;
	if (callbackObject != null){
		transitionCallbackObject = callbackObject;
		transitionCallback = true;
	}
	doTransition = true;
}

// TRANSITION TIME CAPTURE (C# SEND MESSAGE)
function Tenkoku_SendTransition(transVal : String){
	values = transVal.Split(","[0]);
	transitionStartTime = values[0];
	transitionTargetTime = values[1];
	transitionDuration = float.Parse(values[2]);
	transitionDirection = float.Parse(values[3]);
	if (values.length == 5){
		callbackObject = GameObject.Find(values[4]);
		if (callbackObject != null){
			transitionCallbackObject = callbackObject;
			transitionCallback = true;
		}
	}
	doTransition = true;
}



// DO TIME TRANSITIONS
function Tenkoku_TransitionTime(){

	//Initialize
	if (transitionTime <= 0.0){

		//clamp direction
		if (transitionDirection > 0.0) transitionDirection = 1.0;
		if (transitionDirection < 0.0) transitionDirection = -1.0;

		//calculate ending time
		setTransHour = Mathf.Clamp(System.Int32.Parse(transitionTargetTime.Substring(0,2)),0,23);
		setTransMinute = Mathf.Clamp(System.Int32.Parse(transitionTargetTime.Substring(3,2)),0,59);
		setTransSecond = Mathf.Clamp(System.Int32.Parse(transitionTargetTime.Substring(6,2)),0,59);
		endTime = setTransSecond + (setTransMinute*60.0) + (setTransHour*3600);

		//calculate starting time
		if (transitionStartTime == null || transitionStartTime == ""){
			startHour = currentHour;
			startMinute = currentMinute;
			startSecond = currentSecond;
		} else {
			startHour = Mathf.Clamp(System.Int32.Parse(transitionStartTime.Substring(0,2)),0,23);
			startMinute = Mathf.Clamp(System.Int32.Parse(transitionStartTime.Substring(3,2)),0,59);
			startSecond = Mathf.Clamp(System.Int32.Parse(transitionStartTime.Substring(6,2)),0,59);
			currentHour = startHour;
			currentMinute = startMinute;
			currentSecond = startSecond;
		}
		startTime = startSecond + (startMinute*60.0) + (startHour*3600);

		//calculate same day flag
		transSameDay = true;
		if (transitionDirection == 1.0 && endTime < startTime) transSameDay = false;
		if (transitionDirection == -1.0 && endTime > startTime) transSameDay = false;

		//set transition target value
		if (transitionDirection == 1.0){
			if (endTime > startTime && transSameDay) timeVal = (endTime - startTime);
			if (endTime < startTime && !transSameDay) timeVal = ((86400 - startTime) + endTime);
		}
		if (transitionDirection == -1.0){
			if (endTime < startTime && transSameDay) timeVal = (startTime - endTime);
			if (endTime > startTime && !transSameDay) timeVal = ((86400 - endTime) + startTime);
		}
		setTransVal = timeVal/transitionDuration;
	}

	//track current time
	currTime = currentSecond + (currentMinute*60.0) + (currentHour*3600);
	if (transitionDirection == 1.0 && currTime <= endTime) transSameDay = true;
	if (transitionDirection == -1.0 && currTime >= endTime) transSameDay = true;


	//check for transition end
	endTransition = false;
	if (transitionDirection == 1.0 && currTime >= (endTime) && transSameDay) endTransition = true;
	if (transitionDirection == -1.0 && currTime <= (endTime) && transSameDay) endTransition = true;

	//END TRANSITION
	if (endTransition){
		useAutoTime = false;
		transitionTime = 0.0;
		doTransition = false;
		currentHour = setTransHour;
		currentMinute = setTransMinute;
		currentSecond = setTransSecond;
		if (transitionCallback){
			if (transitionCallbackObject != null){
				transitionCallbackObject.SendMessage("CaptureTenkokuCallback",SendMessageOptions.DontRequireReceiver);
			}
		}
		transitionCallbackObject = null;
		transitionCallback = false;

	//DO TRANSITION
	} else {
		useAutoTime = true;
		transitionTime += Time.fixedDeltaTime;
		useTimeCompression = setTransVal*transitionDirection*(Mathf.SmoothStep(0.0,1.0,transitionTime/transitionDuration));
	}

}



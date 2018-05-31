#pragma strict

var uiScale : float = 1.0;
//var useCharacter : Transform;

//enum charGen_MenuMode{character,items,skills}
//var menuMode : charGen_MenuMode = charGen_MenuMode.character;

//enum charGen_SubMenuMode{char_body,char_face}
//var subMenuMode : charGen_SubMenuMode = charGen_SubMenuMode.char_body;

//enum charGen_ActionMode{
//	character,items,skills,presets,body,face
//	}
//var actionMode : charGen_ActionMode = charGen_ActionMode.body;


private var loadFlag : boolean = false;
private var tenkokuObject : TenkokuModule;
private var uiCanvasScale : UI.CanvasScaler;

private var sliderTOY : UI.Slider;
private var sliderTOD : UI.Slider;
private var sliderLat : UI.Slider;
private var sliderTmult : UI.Slider;
private var sliderAtSkyBright : UI.Slider;
private var sliderAtNightBright : UI.Slider;
private var sliderAtFog : UI.Slider;
private var sliderAtDensity : UI.Slider;
private var sliderWeAltoStratus : UI.Slider;
private var sliderWeCirrus : UI.Slider;
private var sliderWeCumulus : UI.Slider;
private var sliderWeOvercast : UI.Slider;
private var sliderWeRain : UI.Slider;
private var sliderWeSnow : UI.Slider;
private var sliderWeWind : UI.Slider;
private var sliderWeWindD : UI.Slider;

private var textTOY : UI.Text;
private var textTOD : UI.Text;
private var textLat : UI.Text;
private var textTmult : UI.Text;


private var currentTODVal : float = -1.0;


function Start () {

	//get main object
	tenkokuObject = GameObject.Find("Tenkoku DynamicSky").GetComponent(TenkokuModule) as TenkokuModule;
	uiCanvasScale = this.transform.GetComponent(UI.CanvasScaler) as UI.CanvasScaler;

	//find UI objects
	sliderTOY = this.gameObject.Find("Slider_TimeOfYear").GetComponent(UI.Slider) as UI.Slider;
	sliderTOD = this.gameObject.Find("Slider_TimeOfDay").GetComponent(UI.Slider) as UI.Slider;
	sliderLat = this.gameObject.Find("Slider_Latitude").GetComponent(UI.Slider) as UI.Slider;
	sliderTmult = this.gameObject.Find("Slider_TimeMult").GetComponent(UI.Slider) as UI.Slider;
	sliderAtSkyBright = this.gameObject.Find("Slider_AtSkyBright").GetComponent(UI.Slider) as UI.Slider;
	sliderAtNightBright = this.gameObject.Find("Slider_AtNightBright").GetComponent(UI.Slider) as UI.Slider;
	sliderAtFog = this.gameObject.Find("Slider_AtFog").GetComponent(UI.Slider) as UI.Slider;
	sliderAtDensity = this.gameObject.Find("Slider_AtDensity").GetComponent(UI.Slider) as UI.Slider;
	sliderWeAltoStratus = this.gameObject.Find("Slider_WeAltoStratus").GetComponent(UI.Slider) as UI.Slider;
	sliderWeCirrus = this.gameObject.Find("Slider_WeCirrus").GetComponent(UI.Slider) as UI.Slider;
	sliderWeCumulus = this.gameObject.Find("Slider_WeCumulus").GetComponent(UI.Slider) as UI.Slider;
	sliderWeOvercast = this.gameObject.Find("Slider_WeOvercast").GetComponent(UI.Slider) as UI.Slider;
	sliderWeRain = this.gameObject.Find("Slider_WeRain").GetComponent(UI.Slider) as UI.Slider;
	sliderWeSnow = this.gameObject.Find("Slider_WeSnow").GetComponent(UI.Slider) as UI.Slider;
	sliderWeWind = this.gameObject.Find("Slider_WeWind").GetComponent(UI.Slider) as UI.Slider;
	sliderWeWindD = this.gameObject.Find("Slider_WeWindD").GetComponent(UI.Slider) as UI.Slider;

	textTOY = this.gameObject.Find("Text_TimeOfYearText").GetComponent(UI.Text) as UI.Text;
	textTOD = this.gameObject.Find("Text_TimeOfDayText").GetComponent(UI.Text) as UI.Text;
	textLat = this.gameObject.Find("Text_LatitudeText").GetComponent(UI.Text) as UI.Text;
	textTmult = this.gameObject.Find("Text_TimeMultText").GetComponent(UI.Text) as UI.Text;


}



function Character_SwitchMode(setMode : String){

	/*
	if (setMode == "character"){
		actionMode = charGen_ActionMode.character;
	} else if (setMode == "character preset"){
		actionMode = charGen_ActionMode.presets;
	} else if (setMode == "character body"){
		actionMode = charGen_ActionMode.body;
	} else if (setMode == "character face"){
		actionMode = charGen_ActionMode.face;
	} else if (setMode == "items"){
		actionMode = charGen_ActionMode.items;
	} else if (setMode == "skills"){
		actionMode = charGen_ActionMode.skills;
	}

	ModeHandler();
	*/
	
	
}





function ModeHandler(){

	/*
	//loadFlag = true;

	//main menu
	if (actionMode == charGen_ActionMode.character){
		menuCharacter.SetActive(true);
		menuItems.SetActive(false);
		//menuSkills.SetActive(false);
		subMenuBody.SetActive(true);
	} else if (actionMode == charGen_ActionMode.items){
		menuCharacter.SetActive(false);
		menuItems.SetActive(true);
		//menuSkills.SetActive(false);
	} else if (actionMode == charGen_ActionMode.skills){
		menuCharacter.SetActive(false);
		menuItems.SetActive(false);
		//menuSkills.SetActive(true);
	}

	//sub menus - character
	if (actionMode == charGen_ActionMode.body){
		subMenuBody.SetActive(true);
		subMenuFace.SetActive(false);
	} else if (actionMode == charGen_ActionMode.face){
		subMenuBody.SetActive(false);
		subMenuFace.SetActive(true);
	}

	UpdateData();
	*/
}




function LateUpdate(){

	//CANVAS SCALE
	uiCanvasScale.scaleFactor = uiScale;


	//########################
	// SET TENKOKU DATE/TIME
	//########################

	//set Time of Year
	tenkokuObject.currentMonth = Mathf.Floor(Mathf.Lerp(1,12.99,sliderTOY.value));
	var dayVal : float = Mathf.Lerp(1,12.99,sliderTOY.value)-Mathf.Floor(Mathf.Lerp(1,12.99,sliderTOY.value));
	tenkokuObject.currentDay = Mathf.Floor(Mathf.Lerp(1,30,dayVal));
	textTOY.text = tenkokuObject.currentMonth+"/"+tenkokuObject.currentDay+"/2015";

	//set Time of Day
	if (sliderTmult.value == 0.0){
		tenkokuObject.currentHour = Mathf.Floor(Mathf.Lerp(0,23,sliderTOD.value));
		var minuteVal : float = Mathf.Lerp(0,23,sliderTOD.value)-Mathf.Floor(Mathf.Lerp(0,23,sliderTOD.value));
		tenkokuObject.currentMinute = Mathf.Floor(Mathf.Lerp(0,59,minuteVal));
	}

	var setPM : String = "am";
	var setH : int = tenkokuObject.currentHour+1;
	var setM : String = tenkokuObject.currentMinute.ToString("00");
	if (setH > 12){
		setH = setH - 12;
		setPM = "pm";
	}
	textTOD.text = setH+":"+setM+setPM+" ("+tenkokuObject.currentHour+":"+setM+")";

	//Set Time Multiplier
	tenkokuObject.autoTime = true;
	tenkokuObject.timeCompression = Mathf.Lerp(0.0,2000.0,sliderTmult.value);
	textTmult.text = Mathf.Lerp(0.0,2000.0,sliderTmult.value).ToString("0");
	if (sliderTOD.value >= 1.0 && sliderTmult.value > 0.0){
		sliderTOD.value = 0.0;
	//	sliderTOY.value += (1.0/365.25);
	}

	//Set Latitude
	tenkokuObject.setLatitude = Mathf.Floor(Mathf.Lerp(-90.0,90.0,sliderLat.value));
	textLat.text = tenkokuObject.setLatitude.ToString();



	//###########################
	// SET TENKOKU ATMOSPHERICS
	//###########################
	tenkokuObject.skyBrightness = Mathf.Lerp(0.0,5.0,sliderAtSkyBright.value);
	tenkokuObject.nightBrightness = Mathf.Lerp(0.0,1.0,sliderAtNightBright.value);
	tenkokuObject.fogDistance = Mathf.Lerp(0.0,5000.0,sliderAtFog.value);
	tenkokuObject.atmosphereDensity = Mathf.Lerp(0.0,4.0,sliderAtDensity.value);



	//###########################
	// SET TENKOKU WEATHER
	//###########################
	tenkokuObject.weather_cloudAltoStratusAmt = Mathf.Lerp(0.0,1.0,sliderWeAltoStratus.value);
	tenkokuObject.weather_cloudCirrusAmt = Mathf.Lerp(0.0,1.0,sliderWeCirrus.value);
	tenkokuObject.weather_cloudCumulusAmt = Mathf.Lerp(0.0,1.0,sliderWeCumulus.value);
	tenkokuObject.weather_OvercastAmt = Mathf.Lerp(0.0,1.0,sliderWeOvercast.value);
	tenkokuObject.weather_RainAmt = Mathf.Lerp(0.0,1.0,sliderWeRain.value);
	tenkokuObject.weather_SnowAmt = Mathf.Lerp(0.0,1.0,sliderWeSnow.value);
	tenkokuObject.weather_WindAmt = Mathf.Lerp(0.0,1.0,sliderWeWind.value);
	tenkokuObject.weather_WindDir = Mathf.Lerp(0.0,365.0,sliderWeWindD.value);


}
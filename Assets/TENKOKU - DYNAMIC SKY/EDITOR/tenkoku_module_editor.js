
//@script ExecuteInEditMode()
@CustomEditor (TenkokuModule)






class tenkoku_module_editor extends Editor {

	var isPro : boolean = true;
	var showErrors : boolean = false;
	var showUnderwater : boolean = false;
	var colorEnabled : Color = Color(1.0,1.0,1.0,1.0);
	var colorDisabled : Color = Color(1.0,1.0,1.0,0.25);
	var logoTex : Texture = Resources.Load("textures/gui_tex_tenkokulogo");
	var divTex : Texture = Resources.Load("textures/gui_tex_tenkokudiv");
	var divRevTex : Texture = Resources.Load("textures/gui_tex_tenkokudivrev");
	var divVertTex : Texture = Resources.Load("textures/gui_tex_tenkoku_divvert");

	//var logoTex : Texture2D;
 	var showConfig : boolean = false;
 	var showCelSet : boolean = false;
 	var showTimer : boolean = true;
 	var showSounds : boolean = false;
 
 	var showConfigTime : boolean = false;
 
 
 	var isTime24 : boolean = false;
 	var isSunActive : boolean = true;
 	var isMoonActive : boolean = false;
 	var isStarActive : boolean = false;
 	//var showSplash : boolean = false;
  	//var showWaves : boolean = false;
  	//var showGeneral : boolean = false;
  	//var showColor : boolean = false;
   	//var showReflect : boolean = false;
	//var showUnder : boolean = false;
 	

	function OnInspectorGUI() {
    
    	

    	EditorGUI.BeginChangeCheck();


    	//check for unity vs unity pro
		if (!PlayerSettings.advancedLicense) isPro = false;


		#if UNITY_PRO_LICENSE
			divRevTex = Resources.Load("textures/gui_tex_tenkokudivrev");
			divTex = Resources.Load("textures/gui_tex_tenkokudiv");
			logoTex = Resources.Load("textures/gui_tex_tenkokulogo");
		#else
			divRevTex = Resources.Load("textures/gui_tex_tenkokudivrev_i");
			divTex = Resources.Load("textures/gui_tex_tenkokudiv_i");
			logoTex = Resources.Load("textures/gui_tex_tenkokulogo_i");
		#endif



		//SET SCREEN WIDTH
		var setWidth = Screen.width-220;
		if (setWidth < 120) setWidth = 120;
		
		
		//TENKOKU LOGO
		var buttonText : GUIContent = new GUIContent(""); 
		var buttonStyle : GUIStyle = GUIStyle.none; 
		var rt : Rect = GUILayoutUtility.GetRect(buttonText, buttonStyle);
		var margin : int = 15;
		//GUI.color = colorEnabled;







		//start menu
        //GUI.contentColor = Color(1.0,1.0,1.0,0.4);
		EditorGUI.LabelField(Rect(rt.x+margin+2, rt.y+35, 50, 18),"Version");
		//GUI.contentColor = Color(1.0,1.0,1.0,0.6);
		
		var linkVerRect : Rect = Rect(rt.x+margin+51, rt.y+35, 40, 18);
		EditorGUI.LabelField(linkVerRect,target.tenkokuVersionNumber);
		//if (Event.current.type == EventType.MouseUp && linkVerRect.Contains(Event.current.mousePosition)) Application.OpenURL("http://www.tanukidigital.com/suimono/");
		
		//GUI.contentColor = Color(1.0,1.0,1.0,1.0);
	    //GUI.contentColor = Color(1.0,1.0,1.0,0.4);
	    var linkHelpRect : Rect = Rect(rt.x+margin+165, rt.y+35, 28, 18);
	    var linkBugRect : Rect = Rect(rt.x+margin+165+42, rt.y+35, 65, 18);
	    var linkURLRect : Rect = Rect(rt.x+margin+165+120, rt.y+35, 100, 18);
	    
		if (Event.current.type == EventType.MouseUp && linkHelpRect.Contains(Event.current.mousePosition)) Application.OpenURL("http://www.tanukidigital.com/forum/");
		if (Event.current.type == EventType.MouseUp && linkBugRect.Contains(Event.current.mousePosition)) Application.OpenURL("http://www.tanukidigital.com/forum/");
		if (Event.current.type == EventType.MouseUp && linkURLRect.Contains(Event.current.mousePosition)) Application.OpenURL("http://www.tanukidigital.com/tenkoku/");

		EditorGUI.LabelField(Rect(rt.x+margin+165+30, rt.y+35, 220, 18),"|");
		EditorGUI.LabelField(Rect(rt.x+margin+165+110, rt.y+35, 220, 18),"|");
		
		//GUI.contentColor = Color(1.0,1.0,1.0,0.4);
		EditorGUI.LabelField(linkHelpRect,"help");
		EditorGUI.LabelField(linkBugRect,"report bug");
		EditorGUI.LabelField(linkURLRect,"tanukidigital.com");
		// end menu




        EditorGUI.DrawPreviewTexture(Rect(rt.x+margin,rt.y,387,36),logoTex);
        GUILayout.Space(42.0);

		
		
		
		
        
        //SKY TIMER
        rt = GUILayoutUtility.GetRect(buttonText, buttonStyle);
        EditorGUI.DrawPreviewTexture(Rect(rt.x+margin,rt.y,387,24),divTex);
        target.showTimer = EditorGUI.Foldout(Rect (rt.x+margin+3, rt.y+5, 20, 20), target.showTimer, "");
        GUI.Label (Rect (rt.x+margin+10, rt.y+5, 300, 20), GUIContent ("TIME AND POSITION"));
        
        GUI.color.a = 0.0;
		if (GUI.Button(Rect(rt.x+margin+10, rt.y+5, 370, 20),"")) target.showTimer = !target.showTimer;
		GUI.color.a = 1.0;

        if (target.showTimer){
        	EditorGUI.DrawPreviewTexture(Rect(rt.x+margin,rt.y+259,387,34),divRevTex);
        	GUI.contentColor = Color(0.74,0.65,0.35,1.0);

        	var setAmMargin : float = 0.0;
        	var amLabel : String = "am";

        	target.displayHour = EditorGUI.FloatField(Rect(rt.x+margin+20, rt.y+25, 24, 18), "", target.displayHour);
        	target.currentMinute = EditorGUI.FloatField(Rect(rt.x+margin+50, rt.y+25, 24, 18), "", target.currentMinute);
        	target.currentSecond = EditorGUI.FloatField(Rect(rt.x+margin+80, rt.y+25, 24, 18), "", target.currentSecond);
        	GUI.Label(Rect(rt.x+margin+43, rt.y+25, 10, 18), ":");
        	GUI.Label(Rect(rt.x+margin+73, rt.y+25, 10, 18), ":");
        	GUI.Label(Rect(rt.x+margin+106, rt.y+25, 25, 18), target.hourMode);
        	target.currentMonth = EditorGUI.FloatField(Rect(rt.x+margin+setAmMargin+140, rt.y+25, 25, 18), "", target.currentMonth);
        	target.currentDay = EditorGUI.FloatField(Rect(rt.x+margin+setAmMargin+180, rt.y+25, 25, 18), "", target.currentDay);
        	target.currentYear = EditorGUI.FloatField(Rect(rt.x+margin+setAmMargin+220, rt.y+25, 35, 18), "", target.currentYear);
        	GUI.Label(Rect(rt.x+margin+setAmMargin+168, rt.y+25, 10, 18), "/");
        	GUI.Label(Rect(rt.x+margin+setAmMargin+208, rt.y+25, 10, 18), "/");
        	
        	GUI.contentColor = colorEnabled;
        	target.use24Clock = EditorGUI.Toggle(Rect(rt.x+margin+275, rt.y+25, 60, 15), "", target.use24Clock);
        	GUI.Label (Rect (rt.x+margin+290, rt.y+25, 100, 15), GUIContent("12H Clock"));

			GUILayout.Space(10.0);

        	if (target.autoDateSync){
        		GUI.contentColor = colorDisabled;
				GUI.backgroundColor = colorDisabled;
			}

        	GUI.Label (Rect (rt.x+margin+10, rt.y+55, 80, 15), GUIContent("Year"));
        	target.currentYear = EditorGUI.IntSlider(Rect(rt.x+margin+100, rt.y+55, setWidth+60, 18), "", target.currentYear,-20000,20000);
        	GUI.Label (Rect (rt.x+margin+10, rt.y+75, 80, 15), GUIContent("Month"));
        	target.currentMonth = EditorGUI.IntSlider(Rect(rt.x+margin+100, rt.y+75, setWidth+60, 18), "", target.currentMonth,1,12);
        	GUI.Label (Rect (rt.x+margin+10, rt.y+95, 80, 15), GUIContent("Day"));
        	target.currentDay = EditorGUI.IntSlider(Rect(rt.x+margin+100, rt.y+95, setWidth+60, 18), "", target.currentDay,1,31);
            GUI.contentColor = colorEnabled;
			GUI.backgroundColor = colorEnabled;    	

        	if (target.autoTimeSync){
        		GUI.contentColor = colorDisabled;
				GUI.backgroundColor = colorDisabled;
			}

			GUI.Label (Rect (rt.x+margin+10, rt.y+125, 80, 15), GUIContent("Hour"));
        	target.currentHour = EditorGUI.IntSlider(Rect(rt.x+margin+100, rt.y+125, setWidth+60, 18), "", target.currentHour,0,23);
        	GUI.Label (Rect (rt.x+margin+10, rt.y+145, 80, 15), GUIContent("Minute"));
        	target.currentMinute = EditorGUI.IntSlider(Rect(rt.x+margin+100, rt.y+145, setWidth+60, 18), "", target.currentMinute,0,59);
            GUI.Label (Rect (rt.x+margin+10, rt.y+165, 80, 15), GUIContent("Second"));
        	target.currentSecond = EditorGUI.IntSlider(Rect(rt.x+margin+100, rt.y+165, setWidth+60, 18), "", target.currentSecond,0,59);


        	GUI.contentColor = colorEnabled;
			GUI.backgroundColor = colorEnabled;
			
			GUI.Label (Rect (rt.x+margin+10, rt.y+195, 100, 15), GUIContent ("Latitude"));
			target.setLatitude = EditorGUI.Slider(Rect(rt.x+margin+100, rt.y+195, setWidth+60, 15), "", target.setLatitude, -90.0, 90.0);
			GUI.Label (Rect (rt.x+margin+10, rt.y+215, 100, 15), GUIContent ("Longitude"));
			target.setLongitude = EditorGUI.Slider(Rect(rt.x+margin+100, rt.y+215, setWidth+60, 15), "", target.setLongitude, -180.0, 180.0);
			
        	
     		target.autoTimeSync = EditorGUI.Toggle(Rect(rt.x+margin+10, rt.y+245, 60, 15), "", target.autoTimeSync);
        	GUI.Label (Rect (rt.x+margin+30, rt.y+245, 230, 15), GUIContent("Sync to System Time"));

     		target.autoDateSync = EditorGUI.Toggle(Rect(rt.x+margin+210, rt.y+245, 60, 15), "", target.autoDateSync);
        	GUI.Label (Rect (rt.x+margin+230, rt.y+245, 230, 15), GUIContent("Sync to System Date"));


        	if (target.autoTimeSync){
        		GUI.contentColor = colorDisabled;
				GUI.backgroundColor = colorDisabled;
			}
			target.autoTime = EditorGUI.Toggle(Rect(rt.x+margin+10, rt.y+265, 60, 15), "", target.autoTime);
        	GUI.Label (Rect (rt.x+margin+30, rt.y+265, 140, 15), GUIContent("Advance Time  x"));
        	target.timeCompression = EditorGUI.FloatField(Rect(rt.x+margin+135, rt.y+265, 50, 15), "", target.timeCompression);

        	GUI.Label (Rect (rt.x+margin+205, rt.y+265, 80, 15), GUIContent("Speed Curve"));
        	target.timeCurves = EditorGUI.CurveField(Rect(rt.x+margin+285, rt.y+265, 90, 15), "", target.timeCurves);

        	GUI.contentColor = colorEnabled;
			GUI.backgroundColor = colorEnabled;

        	GUILayout.Space(260.0);

        
        }
        GUILayout.Space(10.0);
        
        
        
        
        //CONFIGURATION
        rt = GUILayoutUtility.GetRect(buttonText, buttonStyle);
        EditorGUI.DrawPreviewTexture(Rect(rt.x+margin,rt.y,387,24),divTex);
        target.showConfig = EditorGUI.Foldout(Rect (rt.x+margin+3, rt.y+5, 20, 20), target.showConfig, "");
        GUI.Label (Rect (rt.x+margin+10, rt.y+5, 300, 20), GUIContent ("CONFIGURATION"));

        GUI.color.a = 0.0;
		if (GUI.Button(Rect(rt.x+margin+10, rt.y+5, 370, 20),"")) target.showConfig = !target.showConfig;
		GUI.color.a = 1.0;

        if (target.showConfig){
        	EditorGUI.DrawPreviewTexture(Rect(rt.x+margin,rt.y+265,387,34),divRevTex);
			GUILayout.Space(10.0);



			EditorGUI.LabelField(Rect(rt.x+margin+10, rt.y+25, 180, 18),"Camera Mode");
			target.cameraTypeIndex = EditorGUI.Popup(Rect(rt.x+margin+165, rt.y+25, 150, 18),"", target.cameraTypeIndex, target.cameraTypeOptions);


			if (target.cameraTypeIndex == 0){
        		GUI.contentColor = colorDisabled;
        		GUI.backgroundColor = colorDisabled;
			}
			GUI.Label (Rect (rt.x+margin+10, rt.y+45, 100, 15), GUIContent ("Main Camera"));
			target.manualCamera = EditorGUI.ObjectField(Rect(rt.x+margin+165, rt.y+45, setWidth, 15), target.manualCamera, Transform, true);
			GUI.contentColor = colorEnabled;
        	GUI.backgroundColor = colorEnabled;


			GUI.Label (Rect (rt.x+margin+10, rt.y+75, 100, 15), GUIContent ("Overall Tint"));
			target.colorOverlay = EditorGUI.ColorField(Rect(rt.x+margin+165, rt.y+75, setWidth, 15), target.colorOverlay);

			GUI.Label (Rect (rt.x+margin+10, rt.y+95, 100, 15), GUIContent ("Sky Tint"));
			target.colorSky = EditorGUI.ColorField(Rect(rt.x+margin+165, rt.y+95, setWidth, 15), target.colorSky);

			GUI.Label (Rect (rt.x+margin+10, rt.y+115, 100, 15), GUIContent ("Ambient Tint"));
			target.colorAmbient = EditorGUI.ColorField(Rect(rt.x+margin+165, rt.y+115, setWidth, 15), target.colorAmbient);

			GUI.Label (Rect (rt.x+margin+10, rt.y+135, 100, 15), GUIContent ("Skybox Ground"));
			target.colorSkyboxGround = EditorGUI.ColorField(Rect(rt.x+margin+165, rt.y+135, setWidth, 15), target.colorSkyboxGround);

         	GUI.Label (Rect (rt.x+margin+10, rt.y+155, 100, 15), GUIContent ("Color Texture"));
        	target.colorRamp = EditorGUI.ObjectField(Rect(rt.x+margin+165, rt.y+155, setWidth, 35), target.colorRamp, Texture2D, true);
        	
			EditorGUI.LabelField(Rect(rt.x+margin+10, rt.y+200, 180, 18),"Scene Light Layers");
			if (target.gameObject.activeInHierarchy){
				target.lightLayer = EditorGUI.MaskField(Rect(rt.x+margin+165, rt.y+200, 150, 18),"", target.lightLayer, target.tenLayerMasks);
			}



        	GUI.Label (Rect (rt.x+margin+10, rt.y+220, 140, 15), GUIContent("Enable Reflection Probe"));
        	target.enableProbe = EditorGUI.Toggle(Rect(rt.x+margin+165, rt.y+220, 40, 15), "", target.enableProbe);
			if (!target.enableProbe){
        		GUI.contentColor = colorDisabled;
        		GUI.backgroundColor = colorDisabled;
			}
        	GUI.Label (Rect (rt.x+margin+200, rt.y+220, 140, 15), GUIContent("Update FPS"));
        	target.reflectionProbeFPS = EditorGUI.FloatField(Rect(rt.x+margin+275, rt.y+220, 40, 15), "", target.reflectionProbeFPS);
        	GUI.contentColor = colorEnabled;
        	GUI.backgroundColor = colorEnabled;

			GUI.Label (Rect (rt.x+margin+10, rt.y+250, 100, 15), GUIContent ("Set Orientation"));
			target.setRotation = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+250, setWidth, 15), "", target.setRotation, 0.0, 359.0);

			GUI.Label (Rect (rt.x+margin+10, rt.y+270, 150, 15), GUIContent ("Set Ambient Colors"));
			target.useAmbient = EditorGUI.Toggle(Rect(rt.x+margin+165, rt.y+270, 60, 15), "", target.useAmbient);


        	GUILayout.Space(265.0);
        }
        GUILayout.Space(10.0);

        


  
        
        //CELESTIAL SETTINGS
        rt = GUILayoutUtility.GetRect(buttonText, buttonStyle);
        EditorGUI.DrawPreviewTexture(Rect(rt.x+margin,rt.y,387,24),divTex);
        target.showCelSet = EditorGUI.Foldout(Rect (rt.x+margin+3, rt.y+5, 20, 20), target.showCelSet, "");
        GUI.Label (Rect (rt.x+margin+10, rt.y+5, 300, 20), GUIContent ("CELESTIAL SETTINGS"));

        GUI.color.a = 0.0;
		if (GUI.Button(Rect(rt.x+margin+10, rt.y+5, 370, 20),"")) target.showCelSet = !target.showCelSet;
		GUI.color.a = 1.0;


        if (target.showCelSet){
        	EditorGUI.DrawPreviewTexture(Rect(rt.x+margin,rt.y+549,387,34),divRevTex);

        	//sun
        	GUI.contentColor = colorEnabled;
        	GUI.backgroundColor = colorEnabled;
			GUI.Label (Rect (rt.x+margin+10, rt.y+28, 100, 20), GUIContent ("Sun Rendering"));
			target.sunTypeIndex = EditorGUI.Popup(Rect(rt.x+margin+165, rt.y+28, setWidth, 18),"",target.sunTypeIndex, target.sunTypeOptions);

			if (target.sunTypeIndex == 2){
				GUI.contentColor = colorDisabled;
				GUI.backgroundColor = colorDisabled;
			}
			
	        GUI.Label (Rect (rt.x+margin+20, rt.y+45, 100, 20), GUIContent ("Light Amount"));
			target.sunBright = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+45, setWidth, 15), "", target.sunBright, 0.0, 5.0);
        	GUI.Label (Rect (rt.x+margin+20, rt.y+65, 180, 15), GUIContent("Sky Amoung (Day)"));
        	target.skyBrightness = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+65, setWidth, 18), "", target.skyBrightness,0.0,5.0);
		    GUI.Label (Rect (rt.x+margin+20, rt.y+85, 100, 20), GUIContent ("Size"));
			target.sunSize = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+85, setWidth, 15), "", target.sunSize, 0.005, 0.1);
			
					
			//moon
			GUI.contentColor = colorEnabled;
			GUI.backgroundColor = colorEnabled;
			GUI.Label (Rect (rt.x+margin+10, rt.y+118, 100, 20), GUIContent ("Moon Rendering"));
			target.moonTypeIndex = EditorGUI.Popup(Rect(rt.x+margin+165, rt.y+118, setWidth, 18),"",target.moonTypeIndex, target.moonTypeOptions);

			if (target.moonTypeIndex == 2){
				GUI.contentColor = colorDisabled;
				GUI.backgroundColor = colorDisabled;
			}
			
	        GUI.Label (Rect (rt.x+margin+20, rt.y+138, 100, 20), GUIContent ("Light Amount"));
			target.moonBright = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+138, setWidth, 15), "", target.moonBright, 0.0, 5.0);

        	GUI.Label (Rect (rt.x+margin+20, rt.y+158, 180, 15), GUIContent("Sky Amount (Night)"));
        	target.nightBrightness = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+158, setWidth, 18), "", target.nightBrightness,0.0,1.0);
	        GUI.Label (Rect (rt.x+margin+20, rt.y+178, 100, 20), GUIContent ("Size"));
			target.moonSize = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+178, setWidth, 15), "", target.moonSize, 0.005, 0.1);


			if (target.moonTypeIndex == 0){
				GUI.contentColor = colorDisabled;
				GUI.backgroundColor = colorDisabled;
			}

			GUI.Label (Rect (rt.x+margin+20, rt.y+198, 100, 20), GUIContent ("Offset"));
			target.moonPos = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+198, setWidth, 15), "", target.moonPos, 0.0, 359.0);
			GUI.Label (Rect (rt.x+margin+20, rt.y+218, 100, 20), GUIContent ("Phase"));
			target.moonPhase = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+218, setWidth, 15), "", target.moonPhase, 0.0, 359.0);
			


			//stars
			GUI.contentColor = colorEnabled;
			GUI.backgroundColor = colorEnabled;
			GUI.Label (Rect (rt.x+margin+10, rt.y+253, 120, 20), GUIContent ("Star Rendering"));
			target.starTypeIndex = EditorGUI.Popup(Rect(rt.x+margin+165, rt.y+253, setWidth, 18),"",target.starTypeIndex, target.starTypeOptions);

			if (target.starTypeIndex == 2){
				GUI.contentColor = colorDisabled;
				GUI.backgroundColor = colorDisabled;
			}
			
        	GUI.Label (Rect (rt.x+margin+20, rt.y+273, 120, 15), GUIContent("Brightness"));
        	target.starIntensity = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+273, setWidth, 18), "", target.starIntensity,0.0,2.0);

           	GUI.Label (Rect (rt.x+margin+20, rt.y+293, 190, 15), GUIContent("Planet Brightness"));
        	target.planetIntensity = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+293, setWidth, 18), "", target.planetIntensity,0.0,2.0);
   
	        //GUI.Label (Rect (rt.x+margin+20, rt.y+313, 120, 20), GUIContent ("Star Size"));
			//target.starSize = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+313, setWidth, 15), "", target.starSize, 0.0, 0.25);
			
	        //GUI.Label (Rect (rt.x+margin+20, rt.y+333, 120, 20), GUIContent ("Constellation Size"));
			//target.starConstSize = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+333, setWidth, 15), "", target.starConstSize, 0.0, 0.25);
			
			if (target.starTypeIndex == 0){
				GUI.contentColor = colorDisabled;
				GUI.backgroundColor = colorDisabled;
			}
			
			GUI.Label (Rect (rt.x+margin+20, rt.y+313, 120, 20), GUIContent ("Star Offset"));
			target.starPos = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+313, setWidth, 15), "", target.starPos, 0.0, 359.0);

			

			//Aurora Borealis
			GUI.contentColor = colorEnabled;
			GUI.backgroundColor = colorEnabled;
			GUI.Label (Rect (rt.x+margin+10, rt.y+344, 120, 20), GUIContent ("Aurora Rendering"));
			target.auroraTypeIndex = EditorGUI.Popup(Rect(rt.x+margin+165, rt.y+344, setWidth, 18),"",target.auroraTypeIndex, target.auroraTypeOptions);
			
			if (target.auroraTypeIndex == 1){
				GUI.contentColor = colorDisabled;
				GUI.backgroundColor = colorDisabled;
			}
			
	        GUI.Label (Rect (rt.x+margin+20, rt.y+364, 120, 20), GUIContent ("Visible Latitude"));
			target.auroraLatitude = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+364, setWidth, 15), "", target.auroraLatitude, 0.0, 90.0);

			GUI.Label (Rect (rt.x+margin+20, rt.y+384, 120, 20), GUIContent("Brightness"));
        	target.auroraIntensity = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+384, setWidth, 18), "", target.auroraIntensity,0.0,1.0);

        	GUI.Label (Rect (rt.x+margin+20, rt.y+404, 120, 20), GUIContent("Speed"));
        	target.auroraSpeed = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+404, setWidth, 18), "", target.auroraSpeed,0.0,2.0);



			//Galaxy / night skybox
			GUI.contentColor = colorEnabled;
			GUI.backgroundColor = colorEnabled;
			GUI.Label (Rect (rt.x+margin+10, rt.y+442, 120, 20), GUIContent ("Galaxy Rendering"));
			target.galaxyTypeIndex = EditorGUI.Popup(Rect(rt.x+margin+165, rt.y+442, setWidth, 18),"",target.galaxyTypeIndex, target.galaxyTypeOptions);
			
			if (target.galaxyTypeIndex == 2){
				GUI.contentColor = colorDisabled;
				GUI.backgroundColor = colorDisabled;
			}
        	GUI.Label (Rect (rt.x+margin+20, rt.y+462, 180, 15), GUIContent("Brightness"));
        	target.galaxyIntensity = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+462, setWidth, 18), "", target.galaxyIntensity,0.0,2.0);

			if (target.galaxyTypeIndex == 0){
				GUI.contentColor = colorDisabled;
				GUI.backgroundColor = colorDisabled;
			}
			GUI.Label (Rect (rt.x+margin+20, rt.y+482, 120, 20), GUIContent ("Galaxy Offset"));
			target.galaxyPos = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+482, setWidth, 15), "", target.galaxyPos, 0.0, 359.0);

			GUI.contentColor = colorEnabled;
			GUI.backgroundColor = colorEnabled;
			if (target.galaxyTypeIndex == 2){
				GUI.contentColor = colorDisabled;
				GUI.backgroundColor = colorDisabled;
			}

         	GUI.Label (Rect (rt.x+margin+20, rt.y+502, 100, 15), GUIContent ("Galaxy Texture"));
         	target.galaxyTexIndex = EditorGUI.Popup(Rect(rt.x+margin+165, rt.y+502, setWidth, 18),"",target.galaxyTexIndex, target.galaxyTexOptions);
         	if (target.galaxyTexIndex == 0){
        		target.galaxyTex = EditorGUI.ObjectField(Rect(rt.x+margin+165, rt.y+522, setWidth, 55), target.galaxyTex, Texture, true);
			} else {
				target.galaxyCubeTex = EditorGUI.ObjectField(Rect(rt.x+margin+165, rt.y+522, setWidth, 55), target.galaxyCubeTex, Texture, true);
			}
        	
        	
        	GUILayout.Space(560.0);
        }
        GUILayout.Space(10.0);

        //#########################################################################################
        
        
        
        
        

        
        
               
        //ATMOSPHERICS
        GUI.contentColor = colorEnabled;
        GUI.backgroundColor = colorEnabled;
        rt = GUILayoutUtility.GetRect(buttonText, buttonStyle);
        EditorGUI.DrawPreviewTexture(Rect(rt.x+margin,rt.y,387,24),divTex);
        target.showConfigAtmos = EditorGUI.Foldout(Rect (rt.x+margin+3, rt.y+5, 20, 20), target.showConfigAtmos, "");
        GUI.Label (Rect (rt.x+margin+10, rt.y+5, 300, 20), GUIContent ("ATMOSPHERICS"));
        var spaceAdjust : float = 0.0;

        GUI.color.a = 0.0;
		if (GUI.Button(Rect(rt.x+margin+10, rt.y+5, 370, 20),"")) target.showConfigAtmos = !target.showConfigAtmos;
		GUI.color.a = 1.0;


        if (target.useSunRays) spaceAdjust += 20;
			
        if (target.showConfigAtmos){
        	EditorGUI.DrawPreviewTexture(Rect(rt.x+margin,rt.y+155+spaceAdjust,387,34),divRevTex);
			GUILayout.Space(10.0);

        	//FOG
        	GUI.Label (Rect (rt.x+margin+10, rt.y+25, 150, 15), GUIContent("Enable Tenkoku Fog"));
        	target.enableFog = EditorGUI.Toggle(Rect(rt.x+margin+165, rt.y+25, 60, 15), "", target.enableFog);

        	GUI.Label (Rect (rt.x+margin+10, rt.y+45, 180, 15), GUIContent("Start Fog"));
        	target.fogAtmosphere = EditorGUI.FloatField(Rect(rt.x+margin+165, rt.y+45, setWidth, 18), "", target.fogAtmosphere);

        	GUI.Label (Rect (rt.x+margin+10, rt.y+65, 180, 15), GUIContent("Fog Distance"));
        	target.fogDistance = EditorGUI.FloatField(Rect(rt.x+margin+165, rt.y+65, setWidth, 18), "", target.fogDistance);

        	GUI.Label (Rect (rt.x+margin+10, rt.y+85, 180, 15), GUIContent("Fog Density"));
        	target.fogDensity = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+85, setWidth, 18), "", target.fogDensity,0.0,1.0);

        	GUI.Label (Rect (rt.x+margin+10, rt.y+105, 180, 15), GUIContent("Fog Dispersion"));
        	target.fogDisperse = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+105, setWidth, 18), "", target.fogDisperse,3.0,40.0);

        	GUI.Label (Rect (rt.x+margin+10, rt.y+125, 180, 15), GUIContent("Atmospheric Density"));
        	target.atmosphereDensity = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+125, setWidth, 18), "", target.atmosphereDensity,0.0,4.0);


			GUI.Label (Rect (rt.x+margin+10, rt.y+155, 150, 15), GUIContent ("Calculate Light Rays"));
			target.useSunRays = EditorGUI.Toggle(Rect(rt.x+margin+165, rt.y+155, 60, 15), "", target.useSunRays);
			
			if (target.useSunRays){
				GUI.Label (Rect (rt.x+margin+10, rt.y+175, 150, 15), GUIContent ("Sun Ray Intensity"));
        		target.sunRayIntensity = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+175, setWidth, 18), "", target.sunRayIntensity,0.0,1.0);
			}

        	GUILayout.Space(155.0 + spaceAdjust);
        }
        GUILayout.Space(10.0);



        
        //WEATHER
        GUI.contentColor = colorEnabled;
        GUI.backgroundColor = colorEnabled;
        rt = GUILayoutUtility.GetRect(buttonText, buttonStyle);
        EditorGUI.DrawPreviewTexture(Rect(rt.x+margin,rt.y,387,24),divTex);
        target.showConfigWeather = EditorGUI.Foldout(Rect (rt.x+margin+3, rt.y+5, 20, 20), target.showConfigWeather, "");
        GUI.Label (Rect (rt.x+margin+10, rt.y+5, 300, 20), GUIContent ("WEATHER"));
        
        GUI.color.a = 0.0;
		if (GUI.Button(Rect(rt.x+margin+10, rt.y+5, 370, 20),"")) target.showConfigWeather = !target.showConfigWeather;
		GUI.color.a = 1.0;

        if (target.showConfigWeather){
        	
			GUILayout.Space(10.0);

						
			
        	GUI.Label (Rect (rt.x+margin+10, rt.y+25, 190, 15), GUIContent("Weather Setting"));
        	target.weatherTypeIndex = EditorGUI.Popup(Rect(rt.x+margin+165, rt.y+25, setWidth, 18),"",target.weatherTypeIndex, target.weatherTypeOptions);

			if (target.weatherTypeIndex == 0){ //custom
				EditorGUI.DrawPreviewTexture(Rect(rt.x+margin,rt.y+340,387,34),divRevTex);

			    GUI.Label (Rect (rt.x+margin+10, rt.y+55, 190, 15), GUIContent("Link Clouds to Timer"));
        		target.cloudLinkToTime = EditorGUI.Toggle(Rect(rt.x+margin+165, rt.y+55, setWidth, 18), "", target.cloudLinkToTime);

	         	GUI.Label (Rect (rt.x+margin+10, rt.y+75, 180, 15), GUIContent("Clouds AltoStratus"));
	        	target.weather_cloudAltoStratusAmt = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+75, setWidth, 18), "", target.weather_cloudAltoStratusAmt,0.0,1.0);
	        	
	        	GUI.Label (Rect (rt.x+margin+10, rt.y+95, 180, 15), GUIContent("Clouds Cirrus"));
	        	target.weather_cloudCirrusAmt = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+95, setWidth, 18), "", target.weather_cloudCirrusAmt,0.0,1.0);

	        	GUI.Label (Rect (rt.x+margin+10, rt.y+115, 180, 15), GUIContent("Clouds Cumulus"));
	        	target.weather_cloudCumulusAmt = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+115, setWidth, 18), "", target.weather_cloudCumulusAmt,0.0,1.0);
	        	
	        	GUI.Label (Rect (rt.x+margin+10, rt.y+135, 180, 15), GUIContent("Overcast Amount"));
	        	target.weather_OvercastAmt = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+135, setWidth, 18), "", target.weather_OvercastAmt,0.0,1.0);


	        	GUI.Label (Rect (rt.x+margin+10, rt.y+155, 180, 15), GUIContent("Cloud Scale"));
	        	target.weather_cloudScale = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+155, setWidth, 18), "", target.weather_cloudScale,0.0,20.0);
	        	       
	        	GUI.Label (Rect (rt.x+margin+10, rt.y+175, 180, 15), GUIContent("Cloud Speed"));
	        	target.weather_cloudSpeed = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+175, setWidth, 18), "", target.weather_cloudSpeed,0.0,1.0);
	        	       


	        	GUI.Label (Rect (rt.x+margin+10, rt.y+205, 180, 15), GUIContent("Rain Amount"));
	        	target.weather_RainAmt = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+205, setWidth, 18), "", target.weather_RainAmt,0.0,1.0);

	        	GUI.Label (Rect (rt.x+margin+10, rt.y+225, 180, 15), GUIContent("Snow Amount"));
	        	target.weather_SnowAmt = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+225, setWidth, 18), "", target.weather_SnowAmt,0.0,1.0);

	         	GUI.Label (Rect (rt.x+margin+10, rt.y+245, 180, 15), GUIContent("Fog Amount"));
	        	target.weather_FogAmt = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+245, setWidth, 18), "", target.weather_FogAmt,0.0,1.0);
	       	
	          	GUI.Label (Rect (rt.x+margin+10, rt.y+265, 180, 15), GUIContent("Fog Max Height"));
	        	target.weather_FogHeight = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+265, setWidth, 18), "", target.weather_FogHeight,0.0,1000.0);
	       	


	        	GUI.Label (Rect (rt.x+margin+10, rt.y+295, 180, 15), GUIContent("Wind Amount"));
	        	target.weather_WindAmt = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+295, setWidth, 18), "", target.weather_WindAmt,0.0,1.0);
	        	
	        	GUI.Label (Rect (rt.x+margin+10, rt.y+315, 180, 15), GUIContent("Wind Direction"));
	        	target.weather_WindDir = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+315, setWidth, 18), "", target.weather_WindDir,0.0,359.0);
			

				GUI.Label (Rect (rt.x+margin+10, rt.y+345, 180, 15), GUIContent("Temperature"));
	        	target.weather_temperature = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+345, setWidth, 18), "", target.weather_temperature,0.0,120.0);
			

				GUILayout.Space(340.0);
			}

			if (target.weatherTypeIndex == 1){ //AUTO Simple
				EditorGUI.DrawPreviewTexture(Rect(rt.x+margin,rt.y+110,387,34),divRevTex);

			    GUI.Label (Rect (rt.x+margin+10, rt.y+45, 190, 15), GUIContent("Link Clouds to Timer"));
        		target.cloudLinkToTime = EditorGUI.Toggle(Rect(rt.x+margin+165, rt.y+45, setWidth, 18), "", target.cloudLinkToTime);

				GUI.Label (Rect (rt.x+margin+10, rt.y+65, 180, 15), GUIContent ("Next Random Pattern"));
				target.weather_forceUpdate = EditorGUI.Toggle(Rect(rt.x+margin+165, rt.y+65, 60, 15), "", target.weather_forceUpdate);  
			
	        	GUI.Label (Rect (rt.x+margin+10, rt.y+85, 180, 15), GUIContent("Weather Pattern Lifetime"));
	        	target.weather_autoForecastTime = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+85, setWidth, 18), "", target.weather_autoForecastTime,0.0,120.0);
	        	
	        	GUI.Label (Rect (rt.x+margin+10, rt.y+105, 180, 15), GUIContent("Weather Transition Speed"));
	        	target.weather_TransitionTime = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+105, setWidth, 18), "", target.weather_TransitionTime,0.0,60.0);



				GUILayout.Space(110.0);
			}

    		if (target.weatherTypeIndex == 2){ //AUTO Advanced
				EditorGUI.DrawPreviewTexture(Rect(rt.x+margin,rt.y+50,387,34),divRevTex);

	        	GUI.Label (Rect (rt.x+margin+10, rt.y+45, 380, 15), GUIContent("Advanced Weather is currently disabled. Coming Soon."));
	        	//target.weather_cloudAltAmt1 = EditorGUI.Slider(Rect(rt.x+margin+165, rt.y+45, setWidth, 18), "", target.weather_cloudAltAmt1,0.0,1.0);

				GUILayout.Space(50.0);
			}    	
        }
        GUILayout.Space(10.0);
        
    






       //SOUND EFFECTS
        GUI.contentColor = colorEnabled;
        GUI.backgroundColor = colorEnabled;
        rt = GUILayoutUtility.GetRect(buttonText, buttonStyle);
        EditorGUI.DrawPreviewTexture(Rect(rt.x+margin,rt.y,387,24),divTex);
        target.showIBL = EditorGUI.Foldout(Rect (rt.x+margin+3, rt.y+5, 20, 20), target.showIBL, "");
        GUI.Label (Rect (rt.x+margin+10, rt.y+5, 300, 20), GUIContent ("SOUND EFFECTS"));
        
        GUI.color.a = 0.0;
		if (GUI.Button(Rect(rt.x+margin+10, rt.y+5, 370, 20),"")) target.showIBL = !target.showIBL;
		GUI.color.a = 1.0;

        if (target.showIBL){


        	EditorGUI.DrawPreviewTexture(Rect(rt.x+margin,rt.y+190,387,34),divRevTex);
			GUILayout.Space(10.0);

			GUI.Label (Rect (rt.x+margin+10, rt.y+25, 190, 15), GUIContent("Enable Sound FX"));
        	target.enableSoundFX = EditorGUI.Toggle(Rect(rt.x+margin+135, rt.y+25, setWidth, 18), "", target.enableSoundFX);

        	if (!target.enableSoundFX){
        		GUI.contentColor = colorDisabled;
        		GUI.backgroundColor = colorDisabled;
        	}

			GUI.Label (Rect (rt.x+margin+10, rt.y+45, 120, 15), GUIContent ("Master Volume"));
			target.overallVolume = EditorGUI.Slider(Rect(rt.x+margin+135, rt.y+45, setWidth+20, 18), "", target.overallVolume,0.0,1.0);


			GUI.Label (Rect (rt.x+margin+10, rt.y+75, 120, 15), GUIContent ("Wind Volume"));
			target.volumeWind = EditorGUI.Slider(Rect(rt.x+margin+135, rt.y+75, setWidth-55, 18), "", target.volumeWind,0.0,1.0);
			target.audioWind = EditorGUI.ObjectField(Rect(rt.x+margin+315, rt.y+75, 70, 18), target.audioWind, AudioClip, true);

			GUI.Label (Rect (rt.x+margin+10, rt.y+95, 120, 15), GUIContent ("Low Turbulence"));
			target.volumeTurb1 = EditorGUI.Slider(Rect(rt.x+margin+135, rt.y+95, setWidth-55, 18), "", target.volumeTurb1,0.0,1.0);
			target.audioTurb1 = EditorGUI.ObjectField(Rect(rt.x+margin+315, rt.y+95, 70, 18), target.audioTurb1, AudioClip, true);

			GUI.Label (Rect (rt.x+margin+10, rt.y+115, 120, 15), GUIContent ("High Turbulence"));
			target.volumeTurb2 = EditorGUI.Slider(Rect(rt.x+margin+135, rt.y+115, setWidth-55, 18), "", target.volumeTurb2,0.0,1.0);
			target.audioTurb2 = EditorGUI.ObjectField(Rect(rt.x+margin+315, rt.y+115, 70, 18), target.audioTurb2, AudioClip, true);

			GUI.Label (Rect (rt.x+margin+10, rt.y+135, 120, 15), GUIContent ("Rain Volume"));
			target.volumeRain = EditorGUI.Slider(Rect(rt.x+margin+135, rt.y+135, setWidth-55, 18), "", target.volumeRain,0.0,1.0);
			target.audioRain = EditorGUI.ObjectField(Rect(rt.x+margin+315, rt.y+135, 70, 18), target.audioRain, AudioClip, true);


			GUI.Label (Rect (rt.x+margin+10, rt.y+165, 120, 15), GUIContent ("Day Ambient"));
			target.volumeAmbDay = EditorGUI.Slider(Rect(rt.x+margin+135, rt.y+165, setWidth-95, 18), "", target.volumeAmbDay,0.0,1.0);
			target.curveAmbDay24 = EditorGUI.CurveField(Rect(rt.x+margin+272, rt.y+164, 45, 10), "", target.curveAmbDay24);
			target.curveAmbDayYR = EditorGUI.CurveField(Rect(rt.x+margin+272, rt.y+173, 45, 10), "", target.curveAmbDayYR);
			target.audioAmbDay = EditorGUI.ObjectField(Rect(rt.x+margin+325, rt.y+165, 60, 18), target.audioAmbDay, AudioClip, true);

			GUI.Label (Rect (rt.x+margin+10, rt.y+185, 120, 15), GUIContent ("Night Ambient"));
			target.volumeAmbNight = EditorGUI.Slider(Rect(rt.x+margin+135, rt.y+185, setWidth-95, 18), "", target.volumeAmbNight,0.0,1.0);
			target.curveAmbNight24 = EditorGUI.CurveField(Rect(rt.x+margin+272, rt.y+184, 45, 10), "", target.curveAmbNight24);
			target.curveAmbNightYR = EditorGUI.CurveField(Rect(rt.x+margin+272, rt.y+193, 45, 10), "", target.curveAmbNightYR);
			target.audioAmbNight = EditorGUI.ObjectField(Rect(rt.x+margin+325, rt.y+185, 60, 18), target.audioAmbNight, AudioClip, true);

	        GUI.contentColor = colorEnabled;
	        GUI.backgroundColor = colorEnabled;


        	GUILayout.Space(150.0);
        }
        
        GUILayout.Space(40.0);    
        






        GUILayout.Space(10.0);
        
        
        
        
        
        GUI.contentColor = colorEnabled;
        GUI.backgroundColor = colorEnabled;
        
        

        if (EditorGUI.EndChangeCheck ()) {
			EditorUtility.SetDirty(target);
		}


    }
    
    


    
}
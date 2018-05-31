#pragma strict

var textObj_fps : UI.Text;
var showFPS : boolean = true;

private var updateInterval = 0.5;
private var accum : float = 0.0; // FPS accumulated over the interval
private var frames : float  = 0; // Frames drawn over the interval
private var timeleft : float; // Left time for current interval


function Start () {
	InvokeRepeating("SetType",0.1,0.5);
}

function LateUpdate () {

	// CALCULATE FPS
	if (showFPS){
	    timeleft -= Time.deltaTime;
	    accum += Time.timeScale/Time.deltaTime;
	    ++frames;
	   

	    // Interval ended - update GUI text and start new interval
	    if( timeleft <= 0.0 )
	    {
	        // display two fractional digits (f2 format)
	        timeleft = updateInterval;
	        accum = 0.0;
	        frames = 0;
	    }
	} else {
		textObj_fps.text = "";
	}

}


function SetType(){
   	if (textObj_fps != null &&  accum > 0 && frames > 0){
		textObj_fps.text = "FPS: "+(accum/frames).ToString("f0");
	}
}
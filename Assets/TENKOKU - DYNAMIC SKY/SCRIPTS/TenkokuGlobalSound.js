#pragma strict


var audioWind : AudioClip;
var audioTurb1 : AudioClip;
var audioTurb2 : AudioClip;
var audioRain : AudioClip;
var audioAmbDay : AudioClip;
var audioAmbNight : AudioClip;

var volWind : float = 1.0;
var volTurb1 : float = 1.0;
var volTurb2 : float = 1.0;
var volRain : float = 1.0;
var volAmbDay : float = 1.0;
var volAmbNight : float = 1.0;

var enableSounds : boolean = true;

private var sourceWind : AudioSource;
private var sourceTurb1 : AudioSource;
private var sourceTurb2 : AudioSource;
private var sourceRain : AudioSource;
private var sourceAmbDay : AudioSource;
private var sourceAmbNight : AudioSource;


function Start () {
	sourceWind = gameObject.AddComponent(AudioSource);
	sourceTurb1 = gameObject.AddComponent(AudioSource);
	sourceTurb2 = gameObject.AddComponent(AudioSource);
	sourceRain = gameObject.AddComponent(AudioSource);
	sourceAmbDay = gameObject.AddComponent(AudioSource);
	sourceAmbNight = gameObject.AddComponent(AudioSource);

	sourceWind.volume = 0.0;
	sourceTurb1.volume = 0.0;
	sourceTurb2.volume = 0.0;
	sourceRain.volume = 0.0;
	sourceAmbDay.volume = 0.0;
	sourceAmbNight.volume = 0.0;

	sourceWind.Stop();
	sourceTurb1.Stop();
	sourceTurb2.Stop();
	sourceRain.Stop();
	sourceAmbDay.Stop();
	sourceAmbNight.Stop();
}



function LateUpdate () {

	if (enableSounds){
		sourceWind.volume = volWind;
		sourceTurb1.volume = volTurb1;
		sourceTurb2.volume = volTurb2;
		sourceRain.volume = volRain;
		sourceAmbDay.volume = volAmbDay;
		sourceAmbNight.volume = volAmbNight;

		if (audioWind != null && !sourceWind.isPlaying){
			sourceWind.clip = audioWind;
			sourceWind.loop = true;
			sourceWind.Play();
		}
		if (audioTurb1 != null && !sourceTurb1.isPlaying){
			sourceTurb1.clip = audioTurb1;
			sourceTurb1.loop = true;
			sourceTurb1.Play();
		}
		if (audioTurb2 != null && !sourceTurb2.isPlaying){
			sourceTurb2.clip = audioTurb2;
			sourceTurb2.loop = true;
			sourceTurb2.Play();
		}
		if (audioRain != null && !sourceRain.isPlaying){
			sourceRain.clip = audioRain;
			sourceRain.loop = true;
			sourceRain.Play();
		}
		if (audioAmbDay != null && !sourceAmbDay.isPlaying){
			sourceAmbDay.clip = audioAmbDay;
			sourceAmbDay.loop = true;
			sourceAmbDay.Play();
		}
		if (audioAmbNight != null && !sourceAmbNight.isPlaying){
			sourceAmbNight.clip = audioAmbNight;
			sourceAmbNight.loop = true;
			sourceAmbNight.Play();
		}

	} else {

		sourceWind.Stop();
		sourceTurb1.Stop();
		sourceTurb2.Stop();
		sourceRain.Stop();
		sourceAmbDay.Stop();
		sourceAmbNight.Stop();
	}

}
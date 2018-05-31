// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "TENKOKU/TenkokuFog" {

Properties {
	_MainTex ("Base (RGB)", 2D) = "black" {}
	_SkyTex ("Base (RGB)", 2D) = "black" {}
	//_FogDistance("Fog Distance",Float) = 1.0
}



CGINCLUDE

	#pragma target 3.0
	#include "UnityCG.cginc"
	#include "Lighting.cginc"

	uniform sampler2D _MainTex, _SkyTex;
	uniform sampler2D_float _CameraDepthTexture;
	sampler2D _CameraDepthNormalsTexture;

	uniform float4 _HeightParams;
	
	// x = start distance
	uniform float4 _DistanceParams;
	
	int4 _SceneFogMode;
	float4 _SceneFogParams;



float _Tenkoku_FogStart;
float _Tenkoku_FogEnd;


	uniform float4 _MainTex_TexelSize;
	
	// for fast world space reconstruction
	uniform float4x4 _FrustumCornersWS;
	uniform float4 _CameraWS;

	half4 _FogColor;
	float _fogSkybox;
	float _fogHorizon;
	float _FogStart;
	float _FogDistance;
	float _camDistance;

	float _Tenkoku_AmbientGI;
	float _Tenkoku_AtmosphereDensity;
	float _Tenkoku_FogDensity;
	float4 _Tenkoku_overcastColor;
	float _tenkokufogFull;

float4 Tenkoku_Vec_SunFwd;

float4x4 _Tenkoku_CameraMV;
samplerCUBE _Tenkoku_EnvironmentCube;
samplerCUBE _Tenkoku_SkyCube;
samplerCUBE _Tenkoku_SnowCube;
sampler2D _Tenkoku_TexFX;
sampler2D _Tenkoku_ParticleTex;


sampler2D _HeatDistortText;
float _Tenkoku_HeatDistortAmt;
float _HeatDistortSpeed;
float _HeatDistortScale;
float _HeatDistortDist;

	struct v2f {
		float4 pos : SV_POSITION;
		float2 uv : TEXCOORD0;
		float2 uv_depth : TEXCOORD1;
		float4 interpolatedRay : TEXCOORD2;
		float4 screenPos: TEXCOORD3;
	};
	
	v2f vert (appdata_img v)
	{
		v2f o;
		half index = v.vertex.z;
		v.vertex.z = 0.1;
		o.pos = UnityObjectToClipPos(v.vertex);
		o.screenPos=ComputeScreenPos(o.pos);

		o.uv = v.texcoord.xy;
		o.uv_depth = v.texcoord.xy;
		
		#if UNITY_UV_STARTS_AT_TOP
		if (_MainTex_TexelSize.y < 0)
			o.uv.y = 1-o.uv.y;
		#endif				


		//set frustrum indexes specifically
		// this fixes fog/effect errors under webGL
		if (0 == (int)index)
			o.interpolatedRay = _FrustumCornersWS[0];
		else if (1 == (int)index)
			o.interpolatedRay = _FrustumCornersWS[1];
		else if (2 == (int)index)
			o.interpolatedRay = _FrustumCornersWS[2];
		else
			o.interpolatedRay = _FrustumCornersWS[3]; 
			
		//o.interpolatedRay.w = index;


		return o;
	}
	

	// Distance-based fog
	float ComputeDistance (float3 camDir, float zdepth)
	{
		float dist; 
		if (_SceneFogMode.y == 1)
			dist = length(camDir);
		return dist;
	}

	// Linear half-space fog, from https://www.terathon.com/lengyel/Lengyel-UnifiedFog.pdf
	float ComputeHalfSpace (float3 wsDir)
	{
		float3 wpos = _CameraWS + wsDir;
		float FH = _HeightParams.x;
		float3 C = _CameraWS;
		float3 V = wsDir;
		float3 P = wpos;
		float3 aV = _HeightParams.w * V;
		float FdotC = _HeightParams.y;
		float k = _HeightParams.z;
		float FdotP = P.y-FH;
		float FdotV = wsDir.y;
		float c1 = k * (FdotP + FdotC);
		float c2 = (1-2*k) * FdotP;
		float g = min(c2, 0.0);
		g = -length(aV) * (c1 - g * g / abs(FdotV+1.0e-5f));
		return g;
	}

	half4 ComputeFog (v2f i, bool distance, bool height) : SV_Target
	{


//CALCULATE VIEW NORMALS
float3 normalValues;
float depthValue;
DecodeDepthNormal(tex2D(_CameraDepthNormalsTexture, i.screenPos.xy), depthValue, normalValues);
float4 viewNormalColor = float4(normalValues, 1);

//GET WORLD NORMAL CUBEMAP
float4 worldNormalColor = texCUBE(_Tenkoku_EnvironmentCube,mul(_Tenkoku_CameraMV, float4(normalValues, 0)).xyz);

//GET SKY CUBEMAP
float4 skyCube = texCUBE(_Tenkoku_SkyCube,mul(_Tenkoku_CameraMV, float4(normalValues, 0)).xyz);




		// Reconstruct world space position & direction
		// towards this screen pixel.
		float rawDepth = SAMPLE_DEPTH_TEXTURE(_CameraDepthTexture,i.uv_depth);
		float dpth = Linear01Depth(rawDepth);
		float4 wsDir = dpth * i.interpolatedRay;


		//CALCULATE FOG
		float diff = _Tenkoku_FogEnd - _Tenkoku_FogStart;
		float invDiff = abs(diff) > 0.0001f ? 1.0 / diff : 0.0;
		_SceneFogParams.z = -invDiff;
		_SceneFogParams.w = _Tenkoku_FogEnd * invDiff;
		half usedpth = _DistanceParams.z + ComputeDistance(wsDir, dpth) + ComputeHalfSpace (wsDir);
		half fogFac = (saturate(max(0.0,usedpth) * _SceneFogParams.z + _SceneFogParams.w));



		//CALCULATE HEAT EFFECT OVERLAY
		half heatDistFac = (saturate(max(0.0,usedpth) * _SceneFogParams.z + _SceneFogParams.w));
		heatDistFac += (saturate(wsDir.y/2000));
		heatDistFac = saturate(lerp(1,0-_HeatDistortDist,heatDistFac));

		//half3 distortTex = UnpackNormal(tex2D(_HeatDistortText,i.uv*_HeatDistortScale+float2(_Time.x*_HeatDistortSpeed,-_Time.x*0.5*_HeatDistortSpeed)));
		half3 distortTex = UnpackNormal(tex2D(_HeatDistortText,i.uv*_HeatDistortScale+float2(0.0,-_Time.x*_HeatDistortSpeed)));
		half2 dUV = i.uv;
		dUV.x += (distortTex.x * (_Tenkoku_HeatDistortAmt*(heatDistFac)));

		i.uv_depth = dUV;
		i.uv = dUV;



		//Recalculate Depth with Heat Distortion
		rawDepth = SAMPLE_DEPTH_TEXTURE(_CameraDepthTexture,i.uv_depth);
		dpth = Linear01Depth(rawDepth);
		wsDir = dpth * i.interpolatedRay;


		//Get Scene Color Info
		half4 sceneColor = tex2D(_MainTex, i.uv);
		half4 skyColor = tex2D(_SkyTex, i.uv);
		half4 reflectColor = tex2D(_SkyTex, float2(i.uv.x-0.5,i.uv.y-0.5));
		half4 sceneFX = tex2D(_Tenkoku_TexFX, i.uv);


		//Recalculate fog with heat distortion
		diff = _Tenkoku_FogEnd - _Tenkoku_FogStart;
		invDiff = abs(diff) > 0.0001f ? 1.0 / diff : 0.0;
		_SceneFogParams.z = -invDiff;
		_SceneFogParams.w = _Tenkoku_FogEnd * invDiff;
		usedpth = _DistanceParams.z + ComputeDistance(wsDir, dpth) + ComputeHalfSpace (wsDir);
		fogFac = (saturate(max(0.0,usedpth) * _SceneFogParams.z + _SceneFogParams.w));



		// Handle skybox fog
		if (rawDepth == 1.0){
			if (_fogSkybox == 1.0){
				fogFac = 1.0;
			}
			if (_fogSkybox == 0.0){
				fogFac = 0.0;
			}
			fogFac += (saturate((wsDir.y/(_camDistance*0.9))));
			fogFac = saturate(lerp(fogFac,0.0,_Tenkoku_overcastColor.a*4.0));
		}


		fogFac = saturate(fogFac+saturate(lerp(1.0,0.0,_Tenkoku_AtmosphereDensity*2.0)));

		//Handle Horizon Fog
		float diff2 = _tenkokufogFull - (10.0);
		float invDiff2 = abs(diff2) > 0.0001f ? 1.0 / diff2 : 0.0;
		half fogFac3 = saturate(max(0.0,usedpth) * -invDiff2 + (_tenkokufogFull * invDiff2));

		if (_fogHorizon == 1.0){
			fogFac *= saturate((wsDir.y/min(_tenkokufogFull,250.0)) + fogFac3);
		}

		


		// Add distance fog
		skyColor = lerp(skyColor,half4(skyColor.r,skyColor.r,skyColor.r,skyColor.a)*0.5,_Tenkoku_overcastColor.a*0.7);

		//final fog tint color
		skyColor.rgb = lerp(skyColor.rgb,skyColor.rgb * _FogColor.rgb,_FogColor.a);

		half4 _SetColor = lerp(skyColor, sceneColor, fogFac);

		half4 fCol = lerp(_SetColor, sceneColor, fogFac);




		//DARKEN FOG
		//if (rawDepth < 1.0){
		if (rawDepth < 1.0){
			fCol = fCol * lerp(0.98,1.0,saturate(lerp(-1,1.0,_Tenkoku_overcastColor.a)));
		}


		//overcast color
		half3 overcastCol = lerp(half3(fCol.r,fCol.r,fCol.r),_Tenkoku_overcastColor.rgb,_Tenkoku_overcastColor.a*(1.0-fogFac)*0.25);
		

		overcastCol.rgb = lerp(overcastCol.rgb,overcastCol.rgb*0.1,_Tenkoku_overcastColor.a * (1-_Tenkoku_AmbientGI));



		fCol.rgb = lerp(fCol.rgb,overcastCol*lerp(1.0,0.5,_Tenkoku_overcastColor.a),_Tenkoku_overcastColor.a*(1.0-fogFac));
		fCol = fCol * lerp(1.0,1.0,_Tenkoku_overcastColor.a);

		//set overall fog density
		fCol = lerp(sceneColor,fCol,_Tenkoku_FogDensity);






//EFFECTS OVERLAY
//half4 skyEffects = tex2D(_Tenkoku_ParticleTex, i.uv);
//half3 skyMask = saturate(skyEffects.rgb - half3(0,1,0));
//if (rawDepth == 1.0){
//	fCol.rgb = fCol.rgb + skyEffects.rgb;//lerp(_SetColor.rgb,skyEffects.rgb,max(max(skyMask.r,skyMask.g),skyMask.b));// * (1.0-fogFac);//lerp(fCol.rgb,skyEffects.rgb,skyEffects.a);
//}


		return fCol;
	}

ENDCG

SubShader
{

	Tags { "RenderType"="Opaque" }
	ZTest Always Cull Off ZWrite Off Fog { Mode Off }

	// 0: distance + height
	Pass
	{
		CGPROGRAM
		#pragma vertex vert
		#pragma fragment frag
		half4 frag (v2f i) : SV_Target { return ComputeFog (i, true, true); }
		ENDCG
	}


}

Fallback off

}

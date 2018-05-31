Shader "TENKOKU/moonsphere_shader" {
 Properties 
 {
 _Color ("Main Color", Color) = (1,1,1,1)
 _AmbientTint ("Ambient Tint", Color) = (1,1,1,1)
 _MainTex ("Base (RGB)", 2D) = "white" {}

 _BRDFTex ("BRDF", 2D) = "white" {}
 _overBright ("OverBright", float) = 1.0
 _dispStrength ("Displace Amount", Range(0.0,3.0)) = 1.0
 _GlowColor ("Glow Color", Color) = (0.5,0.5,0.5,0.5)
 }
 
 SubShader 
 {
 
 

		
		
// Tags {"Queue"= "Overlay+8"}
Tags {"Queue"="Background+1605"}
 Cull Back
 Fog {Mode Off}

Offset 1,993000
Lighting Off
ZWrite Off

CGPROGRAM
#pragma surface surf MyLight alpha nofog noambient noforwardadd

 sampler2D _MainTex;
 fixed4 _AmbientTint;

 float4 Tenkoku_MoonLightColor;
 float4 Tenkoku_Vec_SunFwd;
 sampler2D _Tenkoku_SkyTex;
 float4 skyColor;

 struct Input{
 float4 screenPos;
 	float2 uv_MainTex;
 };


 void surf(Input IN, inout SurfaceOutput o){

 	fixed4 tex = tex2D(_MainTex, IN.uv_MainTex);
	o.Albedo = tex.rgb;
 	o.Alpha = 1.0;

	float4 uv0 = IN.screenPos; uv0.xy;
	uv0 = float4(max(0.001f, uv0.x),max(0.001f, uv0.y),max(0.001f, uv0.z),max(0.001f, uv0.w));
	skyColor = tex2Dproj(_Tenkoku_SkyTex, UNITY_PROJ_COORD(uv0))*0.96;

 }



 fixed4 LightingMyLight(SurfaceOutput s, half3 lightDir, fixed atten){

	half4 light = half4(1,1,1,1);
	half alph = saturate(max(0.0,dot(s.Normal,Tenkoku_Vec_SunFwd)) * 2);
	light.rgb = lerp(skyColor.rgb, s.Albedo.rgb*max(0.5,Tenkoku_MoonLightColor)*5, alph);

	light.rgb = lerp(light.rgb,skyColor.rgb,min(0.8,_AmbientTint.r));


	light.rgb = saturate(light.rgb);

 	return light;
 }
 
      	

 ENDCG
 
 
 
 
 
 
 		
		
		
 
 }
 }
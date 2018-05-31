// Upgrade NOTE: replaced '_Object2World' with 'unity_ObjectToWorld'
// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "TENKOKU/TenkokuSkybox" {
Properties {
	_SunSize ("Sun size", Range(0,1)) = 0.04
	_AtmosphereThickness ("Atmoshpere Thickness", Range(0,5)) = 1.0
	_SkyTint ("Sky Tint", Color) = (.5, .5, .5, 1)
	_GroundColor ("Ground", Color) = (.369, .349, .341, 1)

	_MieColor ("Mie Color", Color) = (1,1,1,1)
	_NightColor ("Night Color", Color) = (1,1,1,1)

	_MoonColor ("Moon Mie Color", Color) = (1,1,1,1)

	_Exposure("Exposure", Range(0, 8)) = 1.3
//_Tex ("Base (RGB) RefStrength (A)", 2D) = "white" {} 
}

SubShader {
	Tags { "Queue"="Background" "RenderType"="Background" "PreviewType"="Skybox" }
	Cull Off ZWrite Off
//Blend SrcAlpha OneMinusSrcAlpha
//Blend One One

	//Offset 1,990000

	Pass {
		
		CGPROGRAM
		#pragma target 3.0
		#pragma vertex vert
		#pragma fragment frag

		#include "UnityCG.cginc"
		#include "Lighting.cginc"

		#pragma multi_compile __ UNITY_COLORSPACE_GAMMA

		uniform half _Exposure;		// HDR exposure
		uniform half4 _GroundColor;
		uniform half _SunSize;
		uniform half3 _SkyTint;
		uniform half3 _MieColor;
		uniform half3 _MoonColor;
		uniform half3 _NightColor;
		uniform half _AtmosphereThickness;

float _Tenkoku_SkyBright;
float _Tenkoku_NightBright;
float4 _TenkokuAmbientColor;
float4 _TenkokuSunColor;
float _Tenkoku_SunSize;
float4 tenkoku_globalTintColor;
float4 tenkoku_globalSkyColor;
float _Tenkoku_AtmosphereDensity;
float4 _Tenkoku_overcastColor;
float _TenkokuExposureFac;
float _TenkokuColorFac;
float4 _TenkokuSkyColor;
float _Tenkoku_AmbientGI;
float4 _Tenkoku_SkyHorizonColor;
//sampler2D _Tex;

sampler2D _GTex;


		#if defined(UNITY_COLORSPACE_GAMMA)
		#define GAMMA 2
		#define COLOR_2_GAMMA(color) color
		#define COLOR_2_LINEAR(color) color*color
		#define LINEAR_2_OUTPUT(color) sqrt(color)
		#else
		#define GAMMA 2.2
		// HACK: to get gfx-tests in Gamma mode to agree until UNITY_ACTIVE_COLORSPACE_IS_GAMMA is working properly
		#define COLOR_2_GAMMA(color) ((unity_ColorSpaceDouble.r>2.0) ? pow(color,1.0/GAMMA) : color)
		#define COLOR_2_LINEAR(color) color
		#define LINEAR_2_LINEAR(color) color
		#endif

		// RGB wavelengths
		// .35 (.62=158), .43 (.68=174), .525 (.75=190)
		static const float3 kDefaultScatteringWavelength = float3(.65, .57, .475);
		static const float3 kVariableRangeForScatteringWavelength = float3(.15, .15, .15);

		#define OUTER_RADIUS 1.025
		static const float kOuterRadius = OUTER_RADIUS;
		static const float kOuterRadius2 = OUTER_RADIUS*OUTER_RADIUS;
		static const float kInnerRadius = 1.0;
		static const float kInnerRadius2 = 1.0;

		static const float kCameraHeight = 0.0001;

		//#define kRAYLEIGH (lerp(0, 0.0025, pow(_AtmosphereThickness,2.5)))		// Rayleigh constant
		#define kRAYLEIGH (lerp(0, 0.0025, pow(_Tenkoku_AtmosphereDensity,2.5)))		// Rayleigh constant
		#define kMIE 0.0010      		// Mie constant
		#define kSUN_BRIGHTNESS 20.0 	// Sun brightness

		#define kMAX_SCATTER 50.0 // Maximum scattering value, to prevent math overflows on Adrenos

		static const half kSunScale = 100.0 * kSUN_BRIGHTNESS;
		static const float kKmESun = kMIE * kSUN_BRIGHTNESS;
		static const float kKm4PI = kMIE * 4.0 * 3.14159265;
		static const float kScale = 1.0 / (OUTER_RADIUS - 1.0);
		static const float kScaleDepth = 0.25;
		static const float kScaleOverScaleDepth = (1.0 / (OUTER_RADIUS - 1.0)) / 0.25;
		static const float kSamples = 2.0; // THIS IS UNROLLED MANUALLY, DON'T TOUCH

		#define MIE_G (-0.990)
		#define MIE_G2 0.9801


float4 Tenkoku_Vec_SunFwd;
float4 Tenkoku_Vec_MoonFwd;


		struct appdata_t {
			float4 vertex : POSITION;
		};

		struct v2f {
				float4 pos : SV_POSITION;
				half3 rayDir : TEXCOORD0;	// Vector for incoming ray, normalized ( == -eyeRay )
				half3 cIn : TEXCOORD1; 		// In-scatter coefficient
				half3 cOut : TEXCOORD2;		// Out-scatter coefficient
				half3 texcoord : TEXCOORD3;
   		}; 

		float scale(float inCos)
		{
			float x = 1.0 - inCos;
			return 0.25 * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));
		}

		v2f vert (appdata_t v)
		{
			v2f OUT;
			UNITY_INITIALIZE_OUTPUT(v2f, OUT)
			OUT.pos = UnityObjectToClipPos(v.vertex);

			float3 kSkyTintInGammaSpace = COLOR_2_GAMMA(_SkyTint * _TenkokuColorFac); // convert tint from Linear back to Gamma
			float3 kScatteringWavelength = lerp (
				kDefaultScatteringWavelength-kVariableRangeForScatteringWavelength,
				kDefaultScatteringWavelength+kVariableRangeForScatteringWavelength,
				half3(1,1,1) - kSkyTintInGammaSpace); // using Tint in sRGB gamma allows for more visually linear interpolation and to keep (.5) at (128, gray in sRGB) point
			float3 kInvWavelength = 1.0 / pow(kScatteringWavelength, 4);

			float kKrESun = kRAYLEIGH * kSUN_BRIGHTNESS;
			float kKr4PI = kRAYLEIGH * 4.0 * 3.14159265;

			float3 cameraPos = float3(0,kInnerRadius + kCameraHeight,0); 	// The camera's current position
		
			// Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the atmosphere)
			float3 eyeRay = normalize(mul((float3x3)unity_ObjectToWorld, v.vertex.xyz));

			OUT.rayDir = half3(-eyeRay);

			float far = 0.0;
			if(eyeRay.y >= 0.0)
			{
				// Sky
				// Calculate the length of the "atmosphere"
				far = sqrt(kOuterRadius2 + kInnerRadius2 * eyeRay.y * eyeRay.y - kInnerRadius2) - kInnerRadius * eyeRay.y;

				float3 pos = cameraPos + far * eyeRay;
				
				// Calculate the ray's starting position, then calculate its scattering offset
				float height = kInnerRadius + kCameraHeight;
				float depth = exp(kScaleOverScaleDepth * (-kCameraHeight));
				float startAngle = dot(eyeRay, cameraPos) / height;
				float startOffset = depth*scale(startAngle);
				
			
				// Initialize the scattering loop variables
				float sampleLength = far / kSamples;
				float scaledLength = sampleLength * kScale;
				float3 sampleRay = eyeRay * sampleLength;
				float3 samplePoint = cameraPos + sampleRay * 0.5;

				// Now loop through the sample rays
				float3 frontColor = float3(0.0, 0.0, 0.0);
				// Weird workaround: WP8 and desktop FL_9_1 do not like the for loop here
				// (but an almost identical loop is perfectly fine in the ground calculations below)
				// Just unrolling this manually seems to make everything fine again.
//				for(int i=0; i<int(kSamples); i++)
				{
					float height = length(samplePoint);
					float depth = exp(kScaleOverScaleDepth * (kInnerRadius - height));
					//float lightAngle = dot(_WorldSpaceLightPos0.xyz, samplePoint) / height;
					float lightAngle = dot(Tenkoku_Vec_SunFwd.xyz, samplePoint) / height;
					

					float cameraAngle = dot(eyeRay, samplePoint) / height;
					float scatter = (startOffset + depth*(scale(lightAngle) - scale(cameraAngle)));
					float3 attenuate = exp(-clamp(scatter, 0.0, kMAX_SCATTER) * (kInvWavelength * kKr4PI + kKm4PI));

					frontColor += attenuate * (depth * scaledLength);
					samplePoint += sampleRay;
				}
				{
					float height = length(samplePoint);
					float depth = exp(kScaleOverScaleDepth * (kInnerRadius - height));
					//float lightAngle = dot(_WorldSpaceLightPos0.xyz, samplePoint) / height;
					float lightAngle = dot(Tenkoku_Vec_SunFwd.xyz, samplePoint) / height;
					float cameraAngle = dot(eyeRay, samplePoint) / height;
					float scatter = (startOffset + depth*(scale(lightAngle) - scale(cameraAngle)));
					float3 attenuate = exp(-clamp(scatter, 0.0, kMAX_SCATTER) * (kInvWavelength * kKr4PI + kKm4PI));

					frontColor += attenuate * (depth * scaledLength);
					samplePoint += sampleRay;
				}



				// Finally, scale the Mie and Rayleigh colors and set up the varying variables for the pixel shader
				OUT.cIn.xyz = frontColor * (kInvWavelength * kKrESun);
				OUT.cOut = frontColor * kKmESun;
			}
			else
			{
				// Ground
				far = (-kCameraHeight) / (min(-0.001, eyeRay.y));

				float3 pos = cameraPos + far * eyeRay;

				// Calculate the ray's starting position, then calculate its scattering offset
				float depth = exp((-kCameraHeight) * (1.0/kScaleDepth));
				float cameraAngle = dot(-eyeRay, pos);
				//float lightAngle = dot(_WorldSpaceLightPos0.xyz, pos);
				float lightAngle = dot(Tenkoku_Vec_SunFwd.xyz, pos);
				float cameraScale = scale(cameraAngle);
				float lightScale = scale(lightAngle);
				float cameraOffset = depth*cameraScale;
				float temp = (lightScale + cameraScale);
				
				// Initialize the scattering loop variables
				float sampleLength = far / kSamples;
				float scaledLength = sampleLength * kScale;
				float3 sampleRay = eyeRay * sampleLength;
				float3 samplePoint = cameraPos + sampleRay * 0.5;
				
				// Now loop through the sample rays
				float3 frontColor = float3(0.0, 0.0, 0.0);
				float3 attenuate;
//				for(int i=0; i<int(kSamples); i++) // Loop removed because we kept hitting SM2.0 temp variable limits. Doesn't affect the image too much.
				{
					float height = length(samplePoint);
					float depth = exp(kScaleOverScaleDepth * (kInnerRadius - height));
					float scatter = depth*temp - cameraOffset;
					attenuate = exp(-clamp(scatter, 0.0, kMAX_SCATTER) * (kInvWavelength * kKr4PI + kKm4PI));
					frontColor += attenuate * (depth * scaledLength);
					samplePoint += sampleRay;
				}
			
				OUT.cIn.xyz = frontColor * (kInvWavelength * kKrESun + kKmESun);
				OUT.cOut.xyz = clamp(attenuate, 0.0, 1.0);


			}

			return OUT;

		}


		// Calculates the Mie phase function
		half getMiePhase(half eyeCos, half eyeCos2)
		{
			half temp = 1.0 + MIE_G2 - 2.0 * MIE_G * eyeCos;
			// A somewhat rough approx for :
			// temp = pow(temp, 1.5);
			temp = smoothstep(0.0, 0.01, temp) * temp;
			temp = max(temp,1.0e-4); // prevent division by zero, esp. in half precision
			return 1.5 * ((1.0 - MIE_G2) / (2.0 + MIE_G2)) * (1.0 + eyeCos2) / temp;
		}

		// Calculates the Rayleigh phase function
		half getRayleighPhase(half eyeCos2)
		{
			return 0.75 + 0.75*eyeCos2;
		}

		half calcSunSpot(half3 vec1, half3 vec2, half size)
		{
			half3 delta = vec1 - vec2;
			half dist = length(delta);
			//half spot = 1.0 - smoothstep(0.0, _SunSize*size, dist);
			//half spot = 1.0 - smoothstep(0.0, _Tenkoku_SunSize * 10.0 *size, dist);
			half spot = 1.0 - smoothstep(0.0, _Tenkoku_SunSize * 10.0 * size, dist);
			return kSunScale * spot * spot;
		}



		half4 frag (v2f IN) : SV_Target
		{
			half3 col = half3(0.0, 0.0, 0.0);
			// < 0.0 means over horizon, add a bit because we need to lerp to hide the horizon line
			
			//Adjust color from HDR
			col *= (_Exposure * _TenkokuExposureFac);


			//custom
			col.rgb *= 1.0-(dot(Tenkoku_Vec_SunFwd.xyz, normalize(IN.rayDir.xyz))*0.7);
			//col.rgb = saturate(col.rgb);

			col.rgb = lerp(col.rgb,half3(col.r,col.r,col.r)*_Tenkoku_AmbientGI,saturate(_Tenkoku_overcastColor.a*10.0));

			//sky brightness
			col.rgb *= _Tenkoku_SkyBright;
			//col.rgb *= _TenkokuAmbientColor.r;




		if(IN.rayDir.y < 0.02)
			{
				half3 ray = normalize(IN.rayDir.xyz);
				//half eyeCos = dot(_WorldSpaceLightPos0.xyz, ray);
				half eyeCos = dot(Tenkoku_Vec_SunFwd.xyz, ray);
				half eyeCos2 = eyeCos * eyeCos;

				// half mie = getMiePhase(eyeCos, eyeCos2);
				//half mie = calcSunSpot(_WorldSpaceLightPos0.xyz, -ray);

				//custom sun
				half mie = calcSunSpot(Tenkoku_Vec_SunFwd.xyz, -ray, 6.0)*0.006;
				mie += calcSunSpot(Tenkoku_Vec_SunFwd.xyz, -ray, 0.08)*10.0;
				mie += calcSunSpot(Tenkoku_Vec_SunFwd.xyz, -ray, 0.05)*10.0;

				mie += calcSunSpot(Tenkoku_Vec_SunFwd.xyz, -ray, 4.0)*0.008;
				mie += calcSunSpot(Tenkoku_Vec_SunFwd.xyz, -ray, 2.0)*0.02;
				mie += calcSunSpot(Tenkoku_Vec_SunFwd.xyz, -ray, 1.0)*0.05;
				mie += calcSunSpot(Tenkoku_Vec_SunFwd.xyz, -ray, 1.7)*0.001;
				mie *= _Tenkoku_AtmosphereDensity;
				mie += calcSunSpot(Tenkoku_Vec_SunFwd.xyz, -ray, 0.6)*0.001;
				


				//custom moon
				half Mmie = calcSunSpot(Tenkoku_Vec_MoonFwd.xyz, -ray, 4.0)*0.02;
				Mmie += calcSunSpot(Tenkoku_Vec_MoonFwd.xyz, -ray, 2.0)*0.03;
				Mmie *= _Tenkoku_AtmosphereDensity;


				mie = mie * lerp(1.0,0.0,_Tenkoku_overcastColor.a);


				col = getRayleighPhase(eyeCos2) * IN.cIn.xyz;

half3 bcol = getRayleighPhase(eyeCos2) * IN.cIn.xyz;
col = lerp(col,max(max(bcol.r,bcol.g),bcol.b),saturate(lerp(-0.5,1.0,tenkoku_globalSkyColor.a)));
half skyFac = saturate(lerp(1.0,0.15,dot(half3(0,1,0), normalize(IN.rayDir.xyz))))*2.0;
col.rgb = lerp(col.rgb,col.rgb*tenkoku_globalSkyColor.rgb,skyFac*tenkoku_globalSkyColor.a);


				// If over horizon, add sun spot. otherwise lerp with ground
				if(IN.rayDir.y < 0.0){
					col += mie * _MieColor * _TenkokuSunColor * IN.cOut;
					col += Mmie * _MoonColor * (1.0-_TenkokuAmbientColor.r) * (_Tenkoku_NightBright*0.1) * 0.1;
				} else {
					half3 groundColor = IN.cIn.xyz + COLOR_2_LINEAR(_GroundColor) * IN.cOut;
					col = lerp(col, groundColor, IN.rayDir.y / 0.02);
				}
			}
			else
			{
				col = IN.cIn.xyz + COLOR_2_LINEAR(_GroundColor) * IN.cOut;
			}



			half3 nBright = half3(1.0,1.0,1.0);
			#if defined(UNITY_COLORSPACE_GAMMA)
				nBright = half3(0.027,0.02,0.025);
			#endif

			//night brightness
			col.rgb = max(col.rgb, _NightColor.rgb * _Tenkoku_NightBright * nBright);
			
			//overcast tint
			//col.rgb = lerp(col.rgb,_Tenkoku_overcastColor.rgb,_Tenkoku_overcastColor.a);
			//col.rgb = lerp(col.rgb,col.rgb+saturate(1.0-(dot(_WorldSpaceLightPos0.xyz, normalize(IN.rayDir.xyz))*1.8)),_Tenkoku_overcastColor.a);

			//overall tint
			col.rgb = lerp(col.rgb,col.rgb*tenkoku_globalTintColor.rgb,tenkoku_globalTintColor.a);

			//tint sky during day
			col.rgb = lerp(col.rgb,col.rgb*_TenkokuSkyColor.rgb,_Tenkoku_AmbientGI);

 		//overcast color
		//half3 overcastCol = lerp(half3(col.r,col.r,col.r),_Tenkoku_overcastColor.rgb,_Tenkoku_overcastColor.a*0.85);
		//lerp(col.rgb,overcastCol,_Tenkoku_overcastColor.a);


//test horizon atmosphere
half ambFac = lerp(1.0,1.0,_TenkokuAmbientColor.r);
half atmosFac = saturate(lerp(0.15,1.0,dot(half3(0,1,0), normalize(IN.rayDir.xyz))))*2.0;
half3 atmosCol = lerp(col.rgb, col.rgb*_Tenkoku_SkyHorizonColor.rgb*lerp(1.0,4.0,_TenkokuAmbientColor.r)*ambFac, atmosFac);
col.rgb = atmosCol;




//night brightness horizon
col.rgb += lerp(0.0,(_NightColor.rgb * 4.0) * saturate(atmosFac * saturate(lerp(0.0,4.0,_Tenkoku_NightBright))) * (1.0-_Tenkoku_AmbientGI) * nBright,1.0-_Tenkoku_AmbientGI);

//brightness control
col.rgb = col.rgb * lerp(1.0,1.2*_Tenkoku_SkyBright,_Tenkoku_AmbientGI);

//reset ground color
half groundFac = saturate(lerp(0.0,8.0,dot(half3(0,1,0), normalize(IN.rayDir.xyz))));
col.rgb = lerp(col.rgb,col.rgb*_GroundColor.rgb,groundFac*_GroundColor.a);

//fixed4 tex = tex2D (_Tex, (IN.pos.xy));
//col.rgb = tex.rgb;







			#if defined(UNITY_COLORSPACE_GAMMA)
				col = LINEAR_2_OUTPUT(col*5.0);
			#endif
 


			return half4(col,1.0);
		}
		ENDCG 
	}
} 	


Fallback Off

}

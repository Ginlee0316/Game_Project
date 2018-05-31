// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "TENKOKU/cloud_plane" {
	Properties {
		_cloudHeight ("Cloud Height", float) = 1.0
		//_cloudSpeed ("Cloud Speed", float) = 1.0
		_sizeCloud ("Cloud Size", Range(0.0, 1.0)) = 1.0

		_amtCloudS ("Cloud Stratus", Range(0.0, 1.0)) = 1.0
		_amtCloudC ("Cloud Cirrus", Range(0.0, 1.0)) = 1.0
		_amtCloudM ("Cloud Cumulus", Range(0.0, 1.0)) = 1.0
		_amtCloudO ("Cloud Overcast", Range(0.0, 1.0)) = 1.0

		_clpCloud ("Cloud Clip", Range(0.0, 1.0)) = 1.0

		_colTint ("Cloud Tint", Color) = (1.0, 1.0, 1.0, 1.0)

		_colCloudS ("Cloud Stratus Color", Color) = (1.0, 1.0, 1.0, 1.0)
		_colCloudC ("Cloud Cirrus Color", Color) = (1.0, 1.0, 1.0, 1.0)
		_colCloud ("Cloud Cumulus Color", Color) = (1.0, 1.0, 1.0, 1.0)
		_colCloudO ("Cloud Overcast Color", Color) = (1.0, 1.0, 1.0, 1.0)
		_MainTex ("Clouds A", 2D) = "white" {}
		_CloudTexB ("Clouds B)", 2D) = "white" {}
		_BlendTex ("Blend", 2D) = "white" {}
	}
	SubShader {





//#####  ALTOSTRATUS CLOUD  #####
		Tags { "Queue"="Transparent-1" }
		Fog {Mode Off}
		Blend SrcAlpha OneMinusSrcAlpha
 		Offset 1,880000
 		Fog {Mode Off}
 		
		CGPROGRAM
		#pragma target 3.0
		#pragma surface surf CloudLight vertex:vert alpha nofog noambient noforwardadd
		sampler2D _MainTex;
		sampler2D _BlendTex;
		float _cloudHeight;
		//float _cloudSpeed;
		float4 _colCloudS;
		float _clpCloud;
		float4 windCoords;
		float _amtCloudS;
		float4 _TenkokuCloudColor;
		float4 _TenkokuCloudHighlightColor;
		sampler2D _Tenkoku_SkyTex;
		float4 _Tenkoku_overcastColor;
		float4 skyColor,_cloudSpd;
	float depth;
	float _Tenkoku_shaderDepth;

		struct Input {
			float4 screenPos;	
			//float3 pos;
			float2 uv_MainTex;
			float2 uv_BlendTex;
		};
		fixed4 LightingCloudLight(SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten){
			fixed4 col;


			//base color
			col.rgb = _TenkokuCloudColor.rgb*1.0;
			//light direction highlights
			col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb,saturate(dot(-viewDir,lightDir))*0.0);
			//upper lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,0.5);
			//lower lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,saturate(dot(s.Normal,lightDir))*0.5);
			col.rgb = saturate(col.rgb);

			//alpha
			col.a = s.Alpha;

			//overcast
			col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);

			//col.rgb = lerp(col.rgb,_Tenkoku_overcastColor.rgb,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			//col.a = lerp(col.a,col.a*0.08,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));

col.rgb = lerp(col.rgb,skyColor*lerp(1.25,1.15,_Tenkoku_shaderDepth),depth);

//darken cloud for overcast
//col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb*0.85,saturate(_Tenkoku_overcastColor.a*1.1));

			col *= atten;
			return col;
		}
		inline void vert (inout appdata_full v, out Input o){
 			UNITY_INITIALIZE_OUTPUT(Input,o);
			//o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
			v.vertex.xyz -= v.normal*0.2;
		}
		void surf (Input IN, inout SurfaceOutput o) {
			//half c = tex2D(_MainTex, IN.uv_MainTex * 1.0 + float2(1.0,_Time*_cloudSpeed*0.3)).b*0.9;
			half c = tex2D(_MainTex, IN.uv_MainTex * 0.5 + (windCoords.xy*_cloudSpd.x)).b;
			//half m = tex2D(_MainTex, IN.uv_MainTex *30.0 + float2(1.0,_Time*(_cloudSpeed*0.3)+max(_Time*0.5,(_cloudSpeed*0.25)))).b;
			o.Albedo = fixed3(1,1,1);
			o.Alpha = c*_amtCloudS;//saturate(lerp(m,2.0,c))*min(0.75,c)*_colCloudS.a;
			o.Alpha *= tex2D(_BlendTex, IN.uv_BlendTex).r;
			
			float4 uv0 = IN.screenPos; uv0.xy;
        	uv0 = float4(max(0.001f, uv0.x),max(0.001f, uv0.y),max(0.001f, uv0.z),max(0.001f, uv0.w));
			skyColor = tex2Dproj(_Tenkoku_SkyTex, UNITY_PROJ_COORD(uv0))*0.8;
			//clip(o.Alpha-_clpCloud);
half dpth = max(IN.screenPos.w,0.001)/500.0;
depth = 1-saturate(lerp(1.75,1.6,dpth)-lerp(1.25,1.0,_Tenkoku_shaderDepth));
		}
		ENDCG
//##### END  #####





//#####  CIRRUS CLOUD  #####
		Tags { "Queue"="Transparent-1" }
		Fog {Mode Off}
		Blend SrcAlpha OneMinusSrcAlpha

 		Offset 1,880000
		CGPROGRAM
		#pragma target 3.0
		#pragma surface surf CloudLight vertex:vert alpha noambient noforwardadd
		sampler2D _MainTex;
		sampler2D _BlendTex;
		float _cloudHeight;
		//float _cloudSpeed;
		float4 _colCloudC;
		float _clpCloud;
		float4 windCoords;
		float _amtCloudC;
		float4 _TenkokuCloudColor;
		float4 _TenkokuCloudHighlightColor;
		sampler2D _Tenkoku_SkyTex;
		float4 _Tenkoku_overcastColor;
		float4 skyColor,_cloudSpd;
	float depth;
	float _Tenkoku_shaderDepth;

		struct Input {
			float4 screenPos;	
			//float3 pos;
			float2 uv_MainTex;
			float2 uv_BlendTex;
		};
		fixed4 LightingCloudLight(SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten){
			fixed4 col;

			//base color
			col.rgb = _TenkokuCloudColor.rgb*1.0;
			//light direction highlights
			col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb,saturate(dot(viewDir,-lightDir))*0.0);
			//upper lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,0.25);
			//lower lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,saturate(dot(s.Normal,lightDir))*0.0);
			col.rgb = saturate(col.rgb);


			col.a = s.Alpha;

			//overcast
			col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);

			//col.rgb = lerp(col.rgb*1.4,col.rgb,1.0-dot(-viewDir,lightDir));

col.rgb = lerp(col.rgb,skyColor*lerp(1.25,1.15,_Tenkoku_shaderDepth),depth);

//darken cloud for overcast
//col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb*0.85,saturate(_Tenkoku_overcastColor.a*1.1));

			col = col * atten;
			return col;
		}
		inline void vert (inout appdata_full v, out Input o){
 			UNITY_INITIALIZE_OUTPUT(Input,o);
			//o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
			v.vertex.xyz -= v.normal*0.1;
		}
		void surf (Input IN, inout SurfaceOutput o) {
			//half c = tex2D(_MainTex, IN.uv_MainTex *1.0 + float2(1.0,_Time*_cloudSpeed*0.5)).g*0.9;
			half c = tex2D(_MainTex, IN.uv_MainTex * 1.4 + (windCoords.xy*_cloudSpd.y)).g;
			//half m = tex2D(_MainTex, IN.uv_MainTex *30.0 + float2(1.0,_Time*(_cloudSpeed*0.5)+max(_Time*0.5,(_cloudSpeed*0.25)))).g;
			o.Albedo = fixed3(1,1,1);
			o.Alpha = c * _amtCloudC;//*_colCloudC.a;
			o.Alpha *= tex2D(_BlendTex, IN.uv_BlendTex).r;
			
			float4 uv0 = IN.screenPos; uv0.xy;
			uv0 = float4(max(0.001f, uv0.x),max(0.001f, uv0.y),max(0.001f, uv0.z),max(0.001f, uv0.w));
			skyColor = tex2Dproj(_Tenkoku_SkyTex, UNITY_PROJ_COORD(uv0))*0.8;
			//clip(o.Alpha-_clpCloud);

half dpth = max(IN.screenPos.w,0.001)/500.0;
depth = 1-saturate(lerp(1.75,1.6,dpth)-lerp(1.25,1.0,_Tenkoku_shaderDepth));

		}
		ENDCG


		Tags { "Queue"="Transparent-1" }
		Fog {Mode Off}
		Blend SrcAlpha OneMinusSrcAlpha

 		Offset 1,880000
		CGPROGRAM
		#pragma target 3.0
		#pragma surface surf CloudLight vertex:vert alpha noambient noforwardadd
		sampler2D _MainTex;
		sampler2D _BlendTex;
		float _cloudHeight;
		//float _cloudSpeed;
		float4 _colCloudC;
		float _clpCloud;
		float4 windCoords;
		float _amtCloudC;
		float4 _TenkokuCloudColor;
		float4 _TenkokuCloudHighlightColor;
		sampler2D _Tenkoku_SkyTex;
		float4 _Tenkoku_overcastColor;
		float4 skyColor,_cloudSpd;
	float depth;
	float _Tenkoku_shaderDepth;

		struct Input {
			float4 screenPos;	
			//float3 pos;
			float2 uv_MainTex;
			float2 uv_BlendTex;
		};
		fixed4 LightingCloudLight(SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten){
			fixed4 col;

			//base color
			col.rgb = _TenkokuCloudColor.rgb*1.0;
			//light direction highlights
			col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb,0.4);
			//upper lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,0.25);
			//lower lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,saturate(dot(s.Normal,lightDir))*0.0);
			col.rgb = saturate(col.rgb);


			col.a = s.Alpha;

			//overcast
			col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);
			//col.rgb = lerp(col.rgb,_Tenkoku_overcastColor.rgb,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			//col.a = lerp(col.a,col.a*0.08,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));

			//col.rgb = lerp(col.rgb*0.4,col.rgb,1.0-dot(-viewDir,lightDir));
col.rgb = lerp(col.rgb,skyColor*lerp(1.25,1.15,_Tenkoku_shaderDepth),depth);

//darken cloud for overcast
//col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb*0.85,saturate(_Tenkoku_overcastColor.a*1.1));

			col = col * atten;
			return col;
		}
		inline void vert (inout appdata_full v, out Input o){
 			UNITY_INITIALIZE_OUTPUT(Input,o);
			//o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
			v.vertex.xyz -= v.normal*0.198;
		}
		void surf (Input IN, inout SurfaceOutput o) {
			//half c = tex2D(_MainTex, IN.uv_MainTex *1.0 + float2(1.0,_Time*_cloudSpeed*0.5)).g*0.9;
			half c = tex2D(_MainTex, IN.uv_MainTex * 1.4 + (windCoords.xy*_cloudSpd.y)).g;
			//half m = tex2D(_MainTex, IN.uv_MainTex *30.0 + float2(1.0,_Time*(_cloudSpeed*0.5)+max(_Time*0.5,(_cloudSpeed*0.25)))).g;
			o.Albedo = fixed3(1,1,1);
			o.Alpha = c*_amtCloudC;//saturate(lerp(m,2.0,c))*min(0.75,c)*_colCloudC.a;
			o.Alpha *= tex2D(_BlendTex, IN.uv_BlendTex).r;
			
			float4 uv0 = IN.screenPos; uv0.xy;
			uv0 = float4(max(0.001f, uv0.x),max(0.001f, uv0.y),max(0.001f, uv0.z),max(0.001f, uv0.w));
			skyColor = tex2Dproj(_Tenkoku_SkyTex, UNITY_PROJ_COORD(uv0))*0.8;
			//clip(o.Alpha-_clpCloud);

half dpth = max(IN.screenPos.w,0.001)/500.0;
depth = 1-saturate(lerp(1.75,1.6,dpth)-lerp(1.25,1.0,_Tenkoku_shaderDepth));


		}
		ENDCG
//##### END  #####








//#####  LOW CLOUD  #####

		Tags { "Queue"="Transparent-1" }
		Fog {Mode Off}
		Blend SrcAlpha OneMinusSrcAlpha
 		Offset 1,880000
		CGPROGRAM
		#pragma target 3.0
		#pragma surface surf CloudLight vertex:vert alpha noambient noforwardadd
		sampler2D _MainTex;
		sampler2D _BlendTex;
		sampler2D _CloudTexB;
		float _cloudHeight;
		//float _cloudSpeed;
		float4 _colCloud;
		float _clpCloud;
		float _sizeCloud;
		float4 windCoords;
		float _amtCloudM;
		float4 _colTint;
		float4 _TenkokuCloudColor;
		float4 _TenkokuCloudHighlightColor;
		sampler2D _Tenkoku_SkyTex;
		float4 _Tenkoku_overcastColor;
		float4 skyColor,_cloudSpd;
	float depth;
	float _Tenkoku_shaderDepth;

		struct Input {
			float4 screenPos;	
			//float3 pos;
			float2 uv_MainTex;
			float2 uv_BlendTex;
			float2 uv_CloudTexB;
		};
		fixed4 LightingCloudLight(SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten){
			fixed4 col;

			//base color
			col.rgb = _TenkokuCloudColor.rgb*1.0;
			//light direction highlights
			col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb,saturate(dot(viewDir,-lightDir))*0.5);
			//upper lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,0.5);
			//lower lighting
			//col.rgb = lerp(col.rgb,skyColor.rgb,saturate(dot(s.Normal,lightDir))*0.0);
			//col.rgb = saturate(col.rgb);

			//direct light highlight
			col.rgb += lerp(0.0,_TenkokuCloudHighlightColor.rgb,saturate(lerp(0.0,1.0,dot(viewDir,-lightDir)))*0.7);

			col.a = s.Alpha * 0.4;

			//overcast
			col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);
			//col.rgb = lerp(col.rgb,_Tenkoku_overcastColor.rgb,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			//col.a = lerp(col.a,col.a*0.08,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));


			col.a *= 0.2;
			col.rgb = lerp(col.rgb,skyColor*lerp(1.25,1.15,_Tenkoku_shaderDepth),depth);

			//darken cloud for overcast
			//col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb*0.85,saturate(_Tenkoku_overcastColor.a*1.1));

			col *= atten;
			return col;
		}
		inline void vert (inout appdata_full v, out Input o){
 			UNITY_INITIALIZE_OUTPUT(Input,o);
			//o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
			v.vertex.xyz += v.normal*0.013*_cloudHeight;
			o.screenPos = UnityObjectToClipPos (v.vertex);
		}
		void surf (Input IN, inout SurfaceOutput o) {
			//half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB + float2(1.0,_Time*_cloudSpeed));
			half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB * 1.0 + (windCoords.xy*_cloudSpd.z));
			half d = tex2D(_MainTex, IN.uv_MainTex * 1.0 + (windCoords.xy*_cloudSpd.z)).a;
			//half m = tex2D(_CloudTexB, IN.uv_CloudTexB *20.0 + float2(1.0,_Time*(_cloudSpeed)+max(_Time*0.5,(_cloudSpeed*0.25)))).a;
			//o.Albedo = _colTint;//fixed3(1,1,1);

			o.Alpha = lerp(0.0,c.r,saturate(lerp(0.0,4.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.g,saturate(lerp(-1.0,3.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.b,saturate(lerp(-2.0,2.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.a,saturate(lerp(-3.0,1.0,_sizeCloud)));
			o.Alpha += lerp(0.0,d,saturate(lerp(-4.0,1.0,_sizeCloud)));
			o.Alpha = saturate(o.Alpha*1.0);//*_amtCloudM;

			half f = tex2D(_CloudTexB, IN.uv_CloudTexB * 8.0 + ((_Time.x*0.1)+windCoords.xy*10.0)).a*0.6;
			o.Alpha = saturate(o.Alpha+lerp(-1.0,0.7,f))*(o.Alpha*3);

			o.Alpha = saturate(o.Alpha);
			o.Alpha *= tex2D(_BlendTex, IN.uv_BlendTex).r;
			
			float4 uv0 = IN.screenPos; uv0.xy;
			uv0 = float4(max(0.001f, uv0.x),max(0.001f, uv0.y),max(0.001f, uv0.z),max(0.001f, uv0.w));
			skyColor = tex2Dproj(_Tenkoku_SkyTex, UNITY_PROJ_COORD(uv0))*0.8;
			clip(o.Alpha-_clpCloud);
			
			half dpth = max(IN.screenPos.w,0.001)/500.0;
			depth = 1-saturate(lerp(1.75,1.6,dpth)-lerp(1.25,1.0,_Tenkoku_shaderDepth));

		}
		ENDCG




		Tags { "Queue"="Transparent-1" }
		Fog {Mode Off}
		Blend SrcAlpha OneMinusSrcAlpha
 		Offset 1,880000
		CGPROGRAM
		#pragma target 3.0
		#pragma surface surf CloudLight vertex:vert alpha noambient noforwardadd
		sampler2D _MainTex;
		sampler2D _BlendTex;
		sampler2D _CloudTexB;
		float _cloudHeight;
		//float _cloudSpeed;
		float4 _colCloud;
		float _clpCloud;
		float _sizeCloud;
		float4 windCoords;
		float _amtCloudM;
		float4 _colTint;
		float4 _TenkokuCloudColor;
		float4 _TenkokuCloudHighlightColor;
		sampler2D _Tenkoku_SkyTex;
		float4 _Tenkoku_overcastColor;
		float4 skyColor,_cloudSpd;
		float depth;
		float _Tenkoku_shaderDepth;

		struct Input {
			float4 screenPos;	
			//float3 pos;
			float2 uv_MainTex;
			float2 uv_BlendTex;
			float2 uv_CloudTexB;
		};
		fixed4 LightingCloudLight(SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten){
			fixed4 col;

			//base color
			col.rgb = _TenkokuCloudColor.rgb*1.0;
			//light direction highlights
			col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb,saturate(dot(-viewDir,lightDir))*0.3);
			//upper lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,0.5);
			//lower lighting
			//col.rgb = lerp(col.rgb,skyColor.rgb,saturate(dot(s.Normal,lightDir))*0.0);
			//col.rgb = saturate(col.rgb);
			
			//direct light highlight
			col.rgb += lerp(0.0,_TenkokuCloudHighlightColor.rgb,saturate(lerp(0.0,1.0,dot(viewDir,-lightDir))));

			col.a = s.Alpha * 0.5;

			//overcast
			col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);
			//col.rgb = lerp(col.rgb,_Tenkoku_overcastColor.rgb,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			//col.a = lerp(col.a,col.a*0.08,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			col.a *= 0.2;
			col.rgb = lerp(col.rgb,skyColor*lerp(1.25,1.15,_Tenkoku_shaderDepth),depth);

			//darken cloud for overcast
			//col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb*0.85,saturate(_Tenkoku_overcastColor.a*1.1));
			col *= atten;
			return col;
		}
		inline void vert (inout appdata_full v, out Input o){
 			UNITY_INITIALIZE_OUTPUT(Input,o);
			//o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
			v.vertex.xyz += v.normal*0.014*_cloudHeight;
			o.screenPos = UnityObjectToClipPos (v.vertex);
		}
		void surf (Input IN, inout SurfaceOutput o) {
			//half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB + float2(1.0,_Time*_cloudSpeed));
			half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB * 1.0 + (windCoords.xy*_cloudSpd.z));
			half d = tex2D(_MainTex, IN.uv_MainTex * 1.0 + (windCoords.xy*_cloudSpd.z)).a;
			//half m = tex2D(_CloudTexB, IN.uv_CloudTexB *20.0 + float2(1.0,_Time*(_cloudSpeed)+max(_Time*0.5,(_cloudSpeed*0.25)))).a;
			o.Albedo = fixed3(1,1,1);

			o.Alpha = lerp(0.0,c.r,saturate(lerp(0.0,4.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.g,saturate(lerp(-1.0,3.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.b,saturate(lerp(-2.0,2.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.a,saturate(lerp(-3.0,1.0,_sizeCloud)));
			o.Alpha += lerp(0.0,d,saturate(lerp(-4.0,1.0,_sizeCloud)));
			o.Alpha = saturate(o.Alpha*1.0);//*_amtCloudM;

			half f = tex2D(_CloudTexB, IN.uv_CloudTexB * 6.0 + ((_Time.x*0.1)+windCoords.xy*8.0)).a*0.4;
			o.Alpha = saturate(o.Alpha+lerp(-1.0,0.7,f))*(o.Alpha*3);

			o.Alpha = saturate(o.Alpha);
			o.Alpha *= tex2D(_BlendTex, IN.uv_BlendTex).r;
			
			float4 uv0 = IN.screenPos; uv0.xy;
			uv0 = float4(max(0.001f, uv0.x),max(0.001f, uv0.y),max(0.001f, uv0.z),max(0.001f, uv0.w));
			skyColor = tex2Dproj(_Tenkoku_SkyTex, UNITY_PROJ_COORD(uv0))*0.8;
			clip(o.Alpha-_clpCloud);
			
			half dpth = max(IN.screenPos.w,0.001)/500.0;
			depth = 1-saturate(lerp(1.75,1.6,dpth)-lerp(1.25,1.0,_Tenkoku_shaderDepth));

		}
		ENDCG




		Tags { "Queue"="Transparent-1" }
		Fog {Mode Off}
		Blend SrcAlpha OneMinusSrcAlpha
 		Offset 1,880000
		CGPROGRAM
		#pragma target 3.0
		#pragma surface surf CloudLight vertex:vert alpha noambient noforwardadd
		sampler2D _MainTex;
		sampler2D _BlendTex;
		sampler2D _CloudTexB;
		float _cloudHeight;
		//float _cloudSpeed;
		float4 _colCloud;
		float _clpCloud;
		float _sizeCloud;
		float4 windCoords;
		float _amtCloudM;
		float4 _colTint;
		float4 _TenkokuCloudColor;
		float4 _TenkokuCloudHighlightColor;
		sampler2D _Tenkoku_SkyTex;
		float4 _Tenkoku_overcastColor;
		float4 skyColor,_cloudSpd;
		float depth;
		float _Tenkoku_shaderDepth;

		struct Input {
			float4 screenPos;	
			//float3 pos;
			float2 uv_MainTex;
			float2 uv_BlendTex;
			float2 uv_CloudTexB;
		};
		fixed4 LightingCloudLight(SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten){
			fixed4 col;

			//base color
			col.rgb = _TenkokuCloudColor.rgb*1.0;
			//light direction highlights
			col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb,saturate(dot(-viewDir,lightDir))*0.2);
			//upper lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,0.4);
			//lower lighting
			//col.rgb = lerp(col.rgb,skyColor.rgb,saturate(dot(s.Normal,lightDir))*0.0);
			//col.rgb = saturate(col.rgb);
			
			//direct light highlight
			col.rgb += lerp(0.0,_TenkokuCloudHighlightColor.rgb,saturate(lerp(0.0,1.0,dot(viewDir,-lightDir)))*1.0);

			col.a = s.Alpha * 0.6;

			//overcast
			col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);
			//col.rgb = lerp(col.rgb,_Tenkoku_overcastColor.rgb,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			//col.a = lerp(col.a,col.a*0.08,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			col.a *= 0.2;
			col.rgb = lerp(col.rgb,skyColor*lerp(1.25,1.15,_Tenkoku_shaderDepth),depth);

			//darken cloud for overcast
			//col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb*0.85,saturate(_Tenkoku_overcastColor.a*1.1));
			col *= atten;
			return col;
		}
		inline void vert (inout appdata_full v, out Input o){
 			UNITY_INITIALIZE_OUTPUT(Input,o);
			//o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
			v.vertex.xyz += v.normal*0.017*_cloudHeight;
			o.screenPos = UnityObjectToClipPos (v.vertex);
		}
		void surf (Input IN, inout SurfaceOutput o) {
			//half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB + float2(1.0,_Time*_cloudSpeed));
			half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB * 1.0 + (windCoords.xy*_cloudSpd.z));
			half d = tex2D(_MainTex, IN.uv_MainTex * 1.0 + (windCoords.xy*_cloudSpd.z)).a;
			//half m = tex2D(_CloudTexB, IN.uv_CloudTexB *20.0 + float2(1.0,_Time*(_cloudSpeed)+max(_Time*0.5,(_cloudSpeed*0.25)))).a;
			o.Albedo = fixed3(1,1,1);

			o.Alpha = lerp(0.0,c.r,saturate(lerp(0.0,4.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.g,saturate(lerp(-1.0,3.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.b,saturate(lerp(-2.0,2.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.a,saturate(lerp(-3.0,1.0,_sizeCloud)));
			o.Alpha += lerp(0.0,d,saturate(lerp(-4.0,1.0,_sizeCloud)));
			o.Alpha = saturate(o.Alpha*1.0);//*_amtCloudM;

			half f = tex2D(_CloudTexB, IN.uv_CloudTexB * 4.0 + ((_Time.x*0.1)+windCoords.xy*6.0)).a*0.5;
			o.Alpha = saturate(o.Alpha+lerp(-1.0,0.7,f))*(o.Alpha*3);

			o.Alpha = saturate(o.Alpha);
			o.Alpha *= tex2D(_BlendTex, IN.uv_BlendTex).r;
			
			float4 uv0 = IN.screenPos; uv0.xy;
			uv0 = float4(max(0.001f, uv0.x),max(0.001f, uv0.y),max(0.001f, uv0.z),max(0.001f, uv0.w));
			skyColor = tex2Dproj(_Tenkoku_SkyTex, UNITY_PROJ_COORD(uv0))*0.8;
			clip(o.Alpha-_clpCloud);
			
			half dpth = max(IN.screenPos.w,0.001)/500.0;
			depth = 1-saturate(lerp(1.75,1.6,dpth)-lerp(1.25,1.0,_Tenkoku_shaderDepth));

		}
		ENDCG





		Tags { "Queue"="Transparent-1" }
		Fog {Mode Off}
		Blend SrcAlpha OneMinusSrcAlpha
 		Offset 1,880000
		CGPROGRAM
		#pragma target 3.0
		#pragma surface surf CloudLight vertex:vert alpha noambient noforwardadd
		sampler2D _MainTex;
		sampler2D _BlendTex;
		sampler2D _CloudTexB;
		float _cloudHeight;
		//float _cloudSpeed;
		float4 _colCloud;
		float _clpCloud;
		float _sizeCloud;
		float4 windCoords;
		float _amtCloudM;
		float4 _colTint;
		float4 _TenkokuCloudColor;
		float4 _TenkokuCloudHighlightColor;
		sampler2D _Tenkoku_SkyTex;
		float4 _Tenkoku_overcastColor;
		float4 skyColor,_cloudSpd;
		float depth;
		float _Tenkoku_shaderDepth;

		struct Input {
			float4 screenPos;	
			//float3 pos;
			float2 uv_MainTex;
			float2 uv_BlendTex;
			float2 uv_CloudTexB;
		};
		fixed4 LightingCloudLight(SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten){
			fixed4 col;

			//base color
			col.rgb = _TenkokuCloudColor.rgb*1.0;
			//light direction highlights
			col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb,saturate(dot(-viewDir,lightDir))*0.2);
			//upper lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,0.4);
			//lower lighting
			//col.rgb = lerp(col.rgb,skyColor.rgb,saturate(dot(s.Normal,lightDir))*0.0);
			//col.rgb = saturate(col.rgb);

			//direct light highlight
			col.rgb += lerp(0.0,_TenkokuCloudHighlightColor.rgb,saturate(lerp(0.0,1.0,dot(viewDir,-lightDir)))*0.7);

			col.a = s.Alpha * 0.7;

			//overcast
			col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);
			//col.rgb = lerp(col.rgb,_Tenkoku_overcastColor.rgb,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			//col.a = lerp(col.a,col.a*0.08,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			col.rgb = lerp(col.rgb,skyColor*lerp(1.25,1.15,_Tenkoku_shaderDepth),depth);

			//darken cloud for overcast
			//col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb*0.85,saturate(_Tenkoku_overcastColor.a*1.1));
			col *= atten;
			return col;
		}
		inline void vert (inout appdata_full v, out Input o){
 			UNITY_INITIALIZE_OUTPUT(Input,o);
			//o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
			v.vertex.xyz += v.normal*0.02*_cloudHeight;
			o.screenPos = UnityObjectToClipPos (v.vertex);
		}
		void surf (Input IN, inout SurfaceOutput o) {
			//half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB + float2(1.0,_Time*_cloudSpeed));
			half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB * 1.0 + (windCoords.xy*_cloudSpd.z));
			half d = tex2D(_MainTex, IN.uv_MainTex * 1.0 + (windCoords.x*_cloudSpd.zy)).a;
			//half m = tex2D(_CloudTexB, IN.uv_CloudTexB *20.0 + float2(1.0,_Time*(_cloudSpeed)+max(_Time*0.5,(_cloudSpeed*0.25)))).a;
			o.Albedo = fixed3(1,1,1);

			o.Alpha = lerp(0.0,c.r,saturate(lerp(0.0,4.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.g,saturate(lerp(-1.0,3.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.b,saturate(lerp(-2.0,2.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.a,saturate(lerp(-3.0,1.0,_sizeCloud)));
			o.Alpha += lerp(0.0,d,saturate(lerp(-4.0,1.0,_sizeCloud)));
			o.Alpha = saturate(o.Alpha*1.0);//*_amtCloudM;

			half f = tex2D(_CloudTexB, IN.uv_CloudTexB * 2.0 + ((_Time.x*0.1)+windCoords.xy*4.0)).a*0.5;
			o.Alpha = saturate(o.Alpha+lerp(-1.0,0.7,f))*(o.Alpha*3);

			o.Alpha = saturate(o.Alpha);
			o.Alpha *= tex2D(_BlendTex, IN.uv_BlendTex).r;
			
			float4 uv0 = IN.screenPos; uv0.xy;
			uv0 = float4(max(0.001f, uv0.x),max(0.001f, uv0.y),max(0.001f, uv0.z),max(0.001f, uv0.w));
			skyColor = tex2Dproj(_Tenkoku_SkyTex, UNITY_PROJ_COORD(uv0))*0.8;
			clip(o.Alpha-_clpCloud);
			
			half dpth = max(IN.screenPos.w,0.001)/500.0;
			depth = 1-saturate(lerp(1.75,1.6,dpth)-lerp(1.25,1.0,_Tenkoku_shaderDepth));

		}
		ENDCG




		Tags { "Queue"="Transparent-1" }
		Fog {Mode Off}
		Blend SrcAlpha OneMinusSrcAlpha
 		Offset 1,880000
		CGPROGRAM
		#pragma target 3.0
		#pragma surface surf CloudLight vertex:vert alpha noambient noforwardadd
		sampler2D _MainTex;
		sampler2D _BlendTex;
		sampler2D _CloudTexB;
		float _cloudHeight;
		//float _cloudSpeed;
		float4 _colCloud;
		float _clpCloud;
		float _sizeCloud;
		float4 windCoords;
		float _amtCloudM;
		float4 _colTint;
		float4 _TenkokuCloudColor;
		float4 _TenkokuCloudHighlightColor;
		sampler2D _Tenkoku_SkyTex;
		float4 _Tenkoku_overcastColor;
		float4 skyColor,_cloudSpd;
		float depth;
		float _Tenkoku_shaderDepth;

		struct Input {
			float4 screenPos;	
			//float3 pos;
			float2 uv_MainTex;
			float2 uv_BlendTex;
			float2 uv_CloudTexB;
		};
		fixed4 LightingCloudLight(SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten){
			fixed4 col;

			//base color
			col.rgb = _TenkokuCloudColor.rgb*1.0;
			//light direction highlights
			col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb,saturate(dot(-viewDir,lightDir))*0.0);
			//upper lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,0.3);
			//lower lighting
			//col.rgb = lerp(col.rgb,skyColor.rgb,saturate(dot(s.Normal,lightDir))*0.0);
			//col.rgb = saturate(col.rgb);
			
			//direct light highlight
			col.rgb += lerp(0.0,_TenkokuCloudHighlightColor.rgb,saturate(lerp(0.0,1.0,dot(viewDir,-lightDir)))*0.5);

			col.a = s.Alpha * 0.8;

			//overcast
			col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);
			//col.rgb = lerp(col.rgb,_Tenkoku_overcastColor.rgb,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			//col.a = lerp(col.a,col.a*0.08,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			col.rgb = lerp(col.rgb,skyColor*lerp(1.25,1.15,_Tenkoku_shaderDepth),depth);

			//darken cloud for overcast
			//col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb*0.85,saturate(_Tenkoku_overcastColor.a*1.1));
			col *= atten;
			return col;
		}
		inline void vert (inout appdata_full v, out Input o){
 			UNITY_INITIALIZE_OUTPUT(Input,o);
			//o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
			v.vertex.xyz += v.normal*0.024*_cloudHeight;
			o.screenPos = UnityObjectToClipPos (v.vertex);
		}
		void surf (Input IN, inout SurfaceOutput o) {
			//half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB + float2(1.0,_Time*_cloudSpeed));
			half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB * 1.0 + (windCoords.xy*_cloudSpd.z));
			half d = tex2D(_MainTex, IN.uv_MainTex * 1.0 + (windCoords.xy*_cloudSpd.z)).a;
			//half m = tex2D(_CloudTexB, IN.uv_CloudTexB *20.0 + float2(1.0,_Time*(_cloudSpeed)+max(_Time*0.5,(_cloudSpeed*0.25)))).a;
			o.Albedo = fixed3(1,1,1);

			o.Alpha = lerp(0.0,c.r,saturate(lerp(0.0,4.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.g,saturate(lerp(-1.0,3.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.b,saturate(lerp(-2.0,2.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.a,saturate(lerp(-3.0,1.0,_sizeCloud)));
			o.Alpha += lerp(0.0,d,saturate(lerp(-4.0,1.0,_sizeCloud)));
			o.Alpha = saturate(o.Alpha*1.0);//*_amtCloudM;

			half f = tex2D(_CloudTexB, IN.uv_CloudTexB * 2.0 + ((_Time.x*0.1)+windCoords.xy*2.0)).a*0.5;
			o.Alpha = saturate(o.Alpha+lerp(-1.0,0.7,f))*(o.Alpha*3);

			o.Alpha = saturate(o.Alpha);
			o.Alpha *= tex2D(_BlendTex, IN.uv_BlendTex).r;
			
			float4 uv0 = IN.screenPos; uv0.xy;
			uv0 = float4(max(0.001f, uv0.x),max(0.001f, uv0.y),max(0.001f, uv0.z),max(0.001f, uv0.w));
			skyColor = tex2Dproj(_Tenkoku_SkyTex, UNITY_PROJ_COORD(uv0))*0.8;
			clip(o.Alpha-_clpCloud);
			
			half dpth = max(IN.screenPos.w,0.001)/500.0;
			depth = 1-saturate(lerp(1.75,1.6,dpth)-lerp(1.25,1.0,_Tenkoku_shaderDepth));

		}
		ENDCG

		//--------------------- end detail clouds




		Tags { "Queue"="Transparent-1" }
		Fog {Mode Off}
		Blend SrcAlpha OneMinusSrcAlpha
 		Offset 1,880000
		CGPROGRAM
		#pragma target 3.0
		#pragma surface surf CloudLight vertex:vert alpha noambient noforwardadd
		sampler2D _MainTex;
		sampler2D _BlendTex;
		sampler2D _CloudTexB;
		float _cloudHeight;
		//float _cloudSpeed;
		float4 _colCloud;
		float _clpCloud;
		float _sizeCloud;
		float4 windCoords;
		float _amtCloudM;
		float4 _colTint;
		float4 _TenkokuCloudColor;
		float4 _TenkokuCloudHighlightColor;
		sampler2D _Tenkoku_SkyTex;
		float4 _Tenkoku_overcastColor;
		float4 skyColor,_cloudSpd;
		float depth;
		float _Tenkoku_shaderDepth;

		struct Input {
			float4 screenPos;	
			//float3 pos;
			float2 uv_MainTex;
			float2 uv_BlendTex;
			float2 uv_CloudTexB;
		};
		fixed4 LightingCloudLight(SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten){
			fixed4 col;

			//base color
			col.rgb = _TenkokuCloudColor.rgb*1.0;
			//light direction highlights
			col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb,saturate(dot(-viewDir,lightDir))*0.0);
			//upper lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,0.25);
			//lower lighting
			//col.rgb = lerp(col.rgb,skyColor.rgb,saturate(dot(s.Normal,lightDir))*0.0);
			//col.rgb = saturate(col.rgb);
			
			//direct light highlight
			col.rgb += lerp(0.0,_TenkokuCloudHighlightColor.rgb,saturate(lerp(0.0,1.0,dot(viewDir,-lightDir)))*0.2);

			col.a = s.Alpha;

			//overcast
			col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);
			//col.rgb = lerp(col.rgb,_Tenkoku_overcastColor.rgb,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			//col.a = lerp(col.a,col.a*0.08,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			col.rgb = lerp(col.rgb,skyColor*lerp(1.25,1.15,_Tenkoku_shaderDepth),depth);

			//darken cloud for overcast
			//col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb*0.85,saturate(_Tenkoku_overcastColor.a*1.1));
			col *= atten;
			return col;
		}
		inline void vert (inout appdata_full v, out Input o){
 			UNITY_INITIALIZE_OUTPUT(Input,o);
			//o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
			v.vertex.xyz += v.normal*0.027*_cloudHeight;
			o.screenPos = UnityObjectToClipPos (v.vertex);
		}
		void surf (Input IN, inout SurfaceOutput o) {
			//half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB + float2(1.0,_Time*_cloudSpeed));
			half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB * 1.0 + (windCoords.xy*_cloudSpd.z));
			half d = tex2D(_MainTex, IN.uv_MainTex * 1.0 + (windCoords.xy*_cloudSpd.z)).a;
			//half m = tex2D(_CloudTexB, IN.uv_CloudTexB *20.0 + float2(1.0,_Time*(_cloudSpeed)+max(_Time*0.5,(_cloudSpeed*0.25)))).a;
			o.Albedo = fixed3(1,1,1);

			o.Alpha = lerp(0.0,c.r,saturate(lerp(0.0,4.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.g,saturate(lerp(-1.0,3.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.b,saturate(lerp(-2.0,2.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.a,saturate(lerp(-3.0,1.0,_sizeCloud)));
			o.Alpha += lerp(0.0,d,saturate(lerp(-4.0,1.0,_sizeCloud)));
			o.Alpha = saturate(o.Alpha*1.0);//*_amtCloudM;
			o.Alpha *= tex2D(_BlendTex, IN.uv_BlendTex).r;
			
			float4 uv0 = IN.screenPos; uv0.xy;
			uv0 = float4(max(0.001f, uv0.x),max(0.001f, uv0.y),max(0.001f, uv0.z),max(0.001f, uv0.w));
			skyColor = tex2Dproj(_Tenkoku_SkyTex, UNITY_PROJ_COORD(uv0))*0.8;
			clip(o.Alpha-_clpCloud);
			
			half dpth = max(IN.screenPos.w,0.001)/500.0;
			depth = 1-saturate(lerp(1.75,1.6,dpth)-lerp(1.25,1.0,_Tenkoku_shaderDepth));

		}
		ENDCG



		Tags { "Queue"="Transparent-1" }
		Fog {Mode Off}
		Blend SrcAlpha OneMinusSrcAlpha
 		Offset 1,880000
		CGPROGRAM
		#pragma target 3.0
		#pragma surface surf CloudLight vertex:vert alpha noambient noforwardadd
		sampler2D _MainTex;
		sampler2D _BlendTex;
		sampler2D _CloudTexB;
		float _cloudHeight;
		//float _cloudSpeed;
		float4 _colCloud;
		float _clpCloud;
		float _sizeCloud;
		float4 windCoords;
		float _amtCloudM;
		float4 _colTint;
		float4 _TenkokuCloudColor;
		float4 _TenkokuCloudHighlightColor;
		sampler2D _Tenkoku_SkyTex;
		float4 _Tenkoku_overcastColor;
		float4 skyColor,_cloudSpd;
		float depth;
		float _Tenkoku_shaderDepth;

		struct Input {
			float4 screenPos;	
			//float3 pos;
			float2 uv_MainTex;
			float2 uv_BlendTex;
			float2 uv_CloudTexB;
		};
		fixed4 LightingCloudLight(SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten){
			fixed4 col;

			//base color
			col.rgb = _TenkokuCloudColor.rgb*1.0;
			//light direction highlights
			col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb,saturate(dot(-viewDir,lightDir))*0.0);
			//upper lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,0.25);
			//lower lighting
			//col.rgb = lerp(col.rgb,skyColor.rgb,saturate(dot(s.Normal,lightDir))*0.0);
			//col.rgb = saturate(col.rgb);

			//direct light highlight
			col.rgb += lerp(0.0,_TenkokuCloudHighlightColor.rgb,saturate(lerp(0.0,1.0,dot(viewDir,-lightDir)))*0.2);

			col.a = s.Alpha;

			//overcast
			col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);
			//col.rgb = lerp(col.rgb,_Tenkoku_overcastColor.rgb,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			//col.a = lerp(col.a,col.a*0.08,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			col.rgb = lerp(col.rgb,skyColor*lerp(1.25,1.15,_Tenkoku_shaderDepth),depth);

			//darken cloud for overcast
			//col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb*0.85,saturate(_Tenkoku_overcastColor.a*1.1));
			col *= atten;
			return col;
		}
		inline void vert (inout appdata_full v, out Input o){
 			UNITY_INITIALIZE_OUTPUT(Input,o);
			//o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
			v.vertex.xyz += v.normal*0.03*_cloudHeight;
			o.screenPos = UnityObjectToClipPos (v.vertex);
		}
		void surf (Input IN, inout SurfaceOutput o) {
			//half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB + float2(1.0,_Time*_cloudSpeed));
			half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB * 1.0 + (windCoords.xy*_cloudSpd.z));
			half d = tex2D(_MainTex, IN.uv_MainTex * 1.0 + (windCoords.xy*_cloudSpd.z)).a;
			//half m = tex2D(_CloudTexB, IN.uv_CloudTexB *20.0 + float2(1.0,_Time*(_cloudSpeed)+max(_Time*0.5,(_cloudSpeed*0.25)))).a;
			o.Albedo = fixed3(1,1,1);

			o.Alpha = lerp(0.0,c.r,saturate(lerp(0.0,4.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.g,saturate(lerp(-1.0,3.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.b,saturate(lerp(-2.0,2.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.a,saturate(lerp(-3.0,1.0,_sizeCloud)));
			o.Alpha += lerp(0.0,d,saturate(lerp(-4.0,1.0,_sizeCloud)));
			o.Alpha = saturate(o.Alpha*1.0);//*_amtCloudM;

			o.Alpha = lerp(-0.1,1.0,o.Alpha);
			o.Alpha *= tex2D(_BlendTex, IN.uv_BlendTex).r;
			
			float4 uv0 = IN.screenPos; uv0.xy;
			uv0 = float4(max(0.001f, uv0.x),max(0.001f, uv0.y),max(0.001f, uv0.z),max(0.001f, uv0.w));
			skyColor = tex2Dproj(_Tenkoku_SkyTex, UNITY_PROJ_COORD(uv0))*0.8;
			clip(o.Alpha-_clpCloud);
			
			half dpth = max(IN.screenPos.w,0.001)/500.0;
			depth = 1-saturate(lerp(1.75,1.6,dpth)-lerp(1.25,1.0,_Tenkoku_shaderDepth));

		}
		ENDCG





		Tags { "Queue"="Transparent-1" }
		Fog {Mode Off}
		Blend SrcAlpha OneMinusSrcAlpha
 		Offset 1,880000
		CGPROGRAM
		#pragma target 3.0
		#pragma surface surf CloudLight vertex:vert alpha noambient noforwardadd
		sampler2D _MainTex;
		sampler2D _BlendTex;
		sampler2D _CloudTexB;
		float _cloudHeight;
		//float _cloudSpeed;
		float4 _colCloud;
		float _clpCloud;
		float _sizeCloud;
		float4 windCoords;
		float _amtCloudM;
		float4 _colTint;
		float4 _TenkokuCloudColor;
		float4 _TenkokuCloudHighlightColor;
		sampler2D _Tenkoku_SkyTex;
		float4 _Tenkoku_overcastColor;
		float4 skyColor,_cloudSpd;
		float depth;
		float _Tenkoku_shaderDepth;

		struct Input {
			float4 screenPos;	
			//float3 pos;
			float2 uv_MainTex;
			float2 uv_BlendTex;
			float2 uv_CloudTexB;
		};
		fixed4 LightingCloudLight(SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten){
			fixed4 col;

			//base color
			col.rgb = _TenkokuCloudColor.rgb*0.7;
			//light direction highlights
			col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb,saturate(dot(-viewDir,lightDir))*0.0);
			//upper lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,0.25);
			//lower lighting
			//col.rgb = lerp(col.rgb,skyColor.rgb,saturate(dot(s.Normal,lightDir))*0.2);
			//col.rgb = saturate(col.rgb);
			
			col.a = s.Alpha;

			//overcast
			col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);
			//col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);
			//col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);
			//col.rgb = lerp(col.rgb,_Tenkoku_overcastColor.rgb,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			//col.a = lerp(col.a,col.a*0.08,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			col.rgb = lerp(col.rgb,skyColor*lerp(1.25,1.15,_Tenkoku_shaderDepth),depth);

			//darken cloud for overcast
			//col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb*0.85,saturate(_Tenkoku_overcastColor.a*1.1));
			col *= atten;
			return col;
		}
		inline void vert (inout appdata_full v, out Input o){
 			UNITY_INITIALIZE_OUTPUT(Input,o);
			//o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
			v.vertex.xyz += v.normal*0.033*_cloudHeight;
			o.screenPos = UnityObjectToClipPos (v.vertex);
		}
		void surf (Input IN, inout SurfaceOutput o) {
			//half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB + float2(1.0,_Time*_cloudSpeed));
			half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB * 1.0 + (windCoords.xy*_cloudSpd.z));
			half d = tex2D(_MainTex, IN.uv_MainTex * 1.0 + (windCoords.xy*_cloudSpd.z)).a;
			//half m = tex2D(_CloudTexB, IN.uv_CloudTexB *20.0 + float2(1.0,_Time*(_cloudSpeed)+max(_Time*0.5,(_cloudSpeed*0.25)))).a;
			o.Albedo = fixed3(1,1,1);

			o.Alpha = lerp(0.0,c.r,saturate(lerp(0.0,4.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.g,saturate(lerp(-1.0,3.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.b,saturate(lerp(-2.0,2.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.a,saturate(lerp(-3.0,1.0,_sizeCloud)));
			o.Alpha += lerp(0.0,d,saturate(lerp(-4.0,1.0,_sizeCloud)));
			o.Alpha = saturate(o.Alpha*1.0);//*_amtCloudM;
			
			o.Alpha = lerp(-0.25,1.0,o.Alpha);	
			o.Alpha *= tex2D(_BlendTex, IN.uv_BlendTex).r;
			
			float4 uv0 = IN.screenPos; uv0.xy;
			uv0 = float4(max(0.001f, uv0.x),max(0.001f, uv0.y),max(0.001f, uv0.z),max(0.001f, uv0.w));
			skyColor = tex2Dproj(_Tenkoku_SkyTex, UNITY_PROJ_COORD(uv0))*0.8;
			clip(o.Alpha-_clpCloud);
						
			half dpth = max(IN.screenPos.w,0.001)/500.0;
			depth = 1-saturate(lerp(1.75,1.6,dpth)-lerp(1.25,1.0,_Tenkoku_shaderDepth));
	
		}
		ENDCG







		Tags { "Queue"="Transparent-1" }
		Fog {Mode Off}
		Blend SrcAlpha OneMinusSrcAlpha
 		Offset 1,880000
		CGPROGRAM
		#pragma target 3.0
		#pragma surface surf CloudLight vertex:vert alpha noambient noforwardadd
		sampler2D _MainTex;
		sampler2D _BlendTex;
		sampler2D _CloudTexB;
		float _cloudHeight;
		//float _cloudSpeed;
		float4 _colCloud;
		float _clpCloud;
		float _sizeCloud;
		float4 windCoords;
		float _amtCloudM;
		float4 _colTint;
		float4 _TenkokuCloudColor;
		float4 _TenkokuCloudHighlightColor;
		sampler2D _Tenkoku_SkyTex;
		float4 _Tenkoku_overcastColor;
		float4 skyColor,_cloudSpd;
		float depth;
		float _Tenkoku_shaderDepth;

		struct Input {
			float4 screenPos;	
			//float3 pos;
			float2 uv_MainTex;
			float2 uv_BlendTex;
			float2 uv_CloudTexB;
		};
		fixed4 LightingCloudLight(SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten){
			fixed4 col;

			//base color
			col.rgb = _TenkokuCloudColor.rgb*0.6;
			//light direction highlights
			col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb,saturate(dot(-viewDir,lightDir))*0.0);
			//upper lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,0.25);
			//lower lighting
			//col.rgb = lerp(col.rgb,skyColor.rgb,saturate(dot(s.Normal,lightDir))*0.7);
			//col.rgb = saturate(col.rgb);
			//

			col.a = s.Alpha * _colCloud.a;

			//overcast
			col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);
			//col.rgb = lerp(col.rgb,_Tenkoku_overcastColor.rgb,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			//col.a = lerp(col.a,col.a*0.08,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			col.rgb = lerp(col.rgb,skyColor*lerp(1.25,1.15,_Tenkoku_shaderDepth),depth);

			//darken cloud for overcast
			//col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb*0.85,saturate(_Tenkoku_overcastColor.a*1.1));
			col *= atten;
			return col;
		}
		inline void vert (inout appdata_full v, out Input o){
 			UNITY_INITIALIZE_OUTPUT(Input,o);
			//o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
			v.vertex.xyz += v.normal*0.038*_cloudHeight;
			o.screenPos = UnityObjectToClipPos (v.vertex);
		}
		void surf (Input IN, inout SurfaceOutput o) {
			//half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB + float2(1.0,_Time*_cloudSpeed));
			half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB * 1.0 + (windCoords.xy*_cloudSpd.z));
			half d = tex2D(_MainTex, IN.uv_MainTex * 1.0 + (windCoords.xy*_cloudSpd.z)).a;
			//half m = tex2D(_CloudTexB, IN.uv_CloudTexB *20.0 + float2(1.0,_Time*(_cloudSpeed)+max(_Time*0.5,(_cloudSpeed*0.25)))).a;
			o.Albedo = fixed3(1,1,1);

			o.Alpha = lerp(0.0,c.r,saturate(lerp(0.0,4.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.g,saturate(lerp(-1.0,3.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.b,saturate(lerp(-2.0,2.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.a,saturate(lerp(-3.0,1.0,_sizeCloud)));
			o.Alpha += lerp(0.0,d,saturate(lerp(-4.0,1.0,_sizeCloud)));
			o.Alpha = saturate(o.Alpha*1.0);//*_amtCloudM;
			
			o.Alpha = lerp(-0.4,1.0,o.Alpha);
			o.Alpha *= tex2D(_BlendTex, IN.uv_BlendTex).r;
			
			float4 uv0 = IN.screenPos; uv0.xy;
			uv0 = float4(max(0.001f, uv0.x),max(0.001f, uv0.y),max(0.001f, uv0.z),max(0.001f, uv0.w));
			skyColor = tex2Dproj(_Tenkoku_SkyTex, UNITY_PROJ_COORD(uv0))*0.8;
			clip(o.Alpha-_clpCloud);

			half dpth = max(IN.screenPos.w,0.001)/500.0;
			depth = 1-saturate(lerp(1.75,1.6,dpth)-lerp(1.25,1.0,_Tenkoku_shaderDepth));

		}
		ENDCG





		Tags { "Queue"="Transparent-1" }
		Fog {Mode Off}
		Blend SrcAlpha OneMinusSrcAlpha
 		Offset 1,880000
		CGPROGRAM
		#pragma target 3.0
		#pragma surface surf CloudLight vertex:vert alpha noambient noforwardadd
		sampler2D _MainTex;
		sampler2D _BlendTex;
		sampler2D _CloudTexB;
		float _cloudHeight;
		//float _cloudSpeed;
		float4 _colCloud;
		float _clpCloud;
		float _sizeCloud;
		float4 windCoords;
		float _amtCloudM;
		float4 _colTint;
		float4 _TenkokuCloudColor;
		float4 _TenkokuCloudHighlightColor;
		sampler2D _Tenkoku_SkyTex;
		float4 _Tenkoku_overcastColor;
		float4 skyColor,_cloudSpd;
		float depth;
		float _Tenkoku_shaderDepth;

		struct Input {
			float4 screenPos;	
			//float3 pos;
			float2 uv_MainTex;
			float2 uv_BlendTex;
			float2 uv_CloudTexB;
		};
		fixed4 LightingCloudLight(SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten){
			fixed4 col;

			//base color
			col.rgb = _TenkokuCloudColor.rgb*0.5;
			//light direction highlights
			col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb,saturate(dot(-viewDir,lightDir))*0.0);
			//upper lighting
			col.rgb = lerp(col.rgb,skyColor.rgb,0.25);
			//lower lighting
			//col.rgb = lerp(col.rgb,skyColor.rgb,saturate(dot(s.Normal,lightDir))*1.0);
			//col.rgb = saturate(col.rgb);

			//alpha
			col.a = s.Alpha * _colCloud.a;

			//overcast
			col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);
			//col.rgb = lerp(col.rgb,_Tenkoku_overcastColor.rgb,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));
			//col.a = lerp(col.a,col.a*0.08,saturate(lerp(0.0,1.0,_Tenkoku_overcastColor.a*4.0)));

			col.rgb = lerp(col.rgb,skyColor*lerp(1.25,1.15,_Tenkoku_shaderDepth),depth);

			//darken cloud for overcast
			//col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb*0.85,saturate(_Tenkoku_overcastColor.a*1.1));


			col *= atten;
			return col;
		}
		inline void vert (inout appdata_full v, out Input o){
 			UNITY_INITIALIZE_OUTPUT(Input,o);
			//o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
			v.vertex.xyz += v.normal*0.04*_cloudHeight;
			o.screenPos = UnityObjectToClipPos (v.vertex);
		}
		void surf (Input IN, inout SurfaceOutput o) {
			//half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB + float2(1.0,_Time*_cloudSpeed));
			half4 c = tex2D(_CloudTexB, IN.uv_CloudTexB * 1.0 + (windCoords.xy*_cloudSpd.z));
			half d = tex2D(_MainTex, IN.uv_MainTex * 1.0 + (windCoords.xy*_cloudSpd.z)).a;
			//half m = tex2D(_CloudTexB, IN.uv_CloudTexB *20.0 + float2(1.0,_Time*(_cloudSpeed)+max(_Time*0.5,(_cloudSpeed*0.25)))).a;
			o.Albedo = fixed3(1,1,1);

			o.Alpha = lerp(0.0,c.r,saturate(lerp(0.0,4.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.g,saturate(lerp(-1.0,3.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.b,saturate(lerp(-2.0,2.0,_sizeCloud)));
			o.Alpha += lerp(0.0,c.a,saturate(lerp(-3.0,1.0,_sizeCloud)));
			o.Alpha += lerp(0.0,d,saturate(lerp(-4.0,1.0,_sizeCloud)));
			o.Alpha = saturate(o.Alpha*1.0);//*_amtCloudM;
			
			o.Alpha = lerp(-0.5,1.0,o.Alpha);
			o.Alpha *= tex2D(_BlendTex, IN.uv_BlendTex).r;

			half s = tex2D(_CloudTexB, IN.uv_CloudTexB * 3.0 + (windCoords.xy*3.0)).a;
			o.Albedo -= lerp(0,2.0,s);

			o.Albedo = saturate(o.Albedo);

			float4 uv0 = IN.screenPos; uv0.xy;
			uv0 = float4(max(0.001f, uv0.x),max(0.001f, uv0.y),max(0.001f, uv0.z),max(0.001f, uv0.w));
			skyColor = tex2Dproj(_Tenkoku_SkyTex, UNITY_PROJ_COORD(uv0))*0.8;
			clip(o.Alpha-_clpCloud);

			half dpth = max(IN.screenPos.w,0.001)/500.0;
			depth = 1-saturate(lerp(1.75,1.6,dpth)-lerp(1.25,1.0,_Tenkoku_shaderDepth));
		}
		ENDCG

//#####  END LOW CLOUD  #####






//#####  OVERCAST CLOUD  #####
		Tags { "Queue"="Transparent-1" }
		Fog {Mode Off}
		Blend SrcAlpha OneMinusSrcAlpha
 		Offset 1,880000
		CGPROGRAM
		#pragma target 3.0
		#pragma surface surf CloudLight vertex:vert alpha noambient noforwardadd
		sampler2D _MainTex;
		sampler2D _BlendTex;
		float _cloudHeight;
		//float _cloudSpeed;
		float4 _colCloudO;
		float _clpCloud;
		float _AmbientShift;
		float4 windCoords;
		float _amtCloudO;
		float4 _TenkokuCloudColor;
		float4 _TenkokuCloudHighlightColor;
		sampler2D _Tenkoku_SkyTex;
		float4 _Tenkoku_overcastColor;
		float4 skyColor,_cloudSpd;
		float depth;
		float _Tenkoku_shaderDepth;
		float4 _TenkokuAmbientColor;

		struct Input {
			float4 screenPos;	
			//float3 pos;
			float2 uv_MainTex;
			float2 uv_BlendTex;
		};
		fixed4 LightingCloudLight(SurfaceOutput s, fixed3 lightDir, half3 viewDir, fixed atten){
			fixed4 col;

			//base color
			col.rgb = _colCloudO.rgb * s.Albedo;

			//alpha
			col.a = _Tenkoku_overcastColor.a;

			//overcast
			//col.rgb = lerp(col.rgb,skyColor.rgb*1.0,_Tenkoku_overcastColor.a);
			half skyFac = max(max(skyColor.r,skyColor.g),skyColor.b);
			//col.rgb = s.Albedo * lerp(1.0,saturate(skyFac*3),saturate(pow(_Tenkoku_overcastColor.a,2)));
			col.rgb = s.Albedo * lerp(0.0,1.0,saturate(skyFac*2));

			skyColor = lerp(skyColor,skyFac,_Tenkoku_overcastColor.a);
			col.rgb = lerp(col.rgb,skyColor*lerp(1.25,1.15,_Tenkoku_shaderDepth),depth);

			//darken cloud for overcast
			//col.rgb = lerp(col.rgb,_TenkokuCloudHighlightColor.rgb*0.85,saturate(_Tenkoku_overcastColor.a*1.1));


			col *= atten;
			return col;
		}
		inline void vert (inout appdata_full v, out Input o){
 			UNITY_INITIALIZE_OUTPUT(Input,o);
			//o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
			v.vertex.xyz += v.normal*0.1;
		}
		void surf (Input IN, inout SurfaceOutput o) {
			//half c = tex2D(_MainTex, IN.uv_MainTex *4.0 + float2(1.0,_Time*_cloudSpeed*0.5)).r;
			half c = tex2D(_MainTex, IN.uv_MainTex * 4.0 + (windCoords.xy*_cloudSpd.w)).r;
			//half m = tex2D(_MainTex, IN.uv_MainTex *30.0 + float2(1.0,_Time*(_cloudSpeed*0.5)+max(_Time*0.5,(_cloudSpeed*0.25)))).r;
			o.Albedo = fixed3(c,c,c);//fixed3(1,1,1);
			//o.Alpha = saturate(lerp(-0.5,0.9,_amtCloudO));//c;//*_colCloudH.a;//saturate(lerp(m,2.0,c))*min(0.75,c)*_colCloudH.a;

			//o.Alpha = saturate(o.Alpha+(1.0-tex2D(_BlendTex, IN.uv_BlendTex).r));
			//o.Alpha *= _amtCloudO;
			//o.Albedo = tex2D(_BlendTex, IN.uv_BlendTex).rgb;
			//o.Alpha = lerp(0.0,0.15,_Tenkoku_overcastColor.a);
			o.Alpha = lerp(0.0,4.0,saturate(_Tenkoku_overcastColor.a*2));
			o.Alpha *= tex2D(_BlendTex, IN.uv_BlendTex).r;

			float4 uv0 = IN.screenPos; uv0.xy;
			uv0 = float4(max(0.001f, uv0.x),max(0.001f, uv0.y),max(0.001f, uv0.z),max(0.001f, uv0.w));
			skyColor = tex2Dproj(_Tenkoku_SkyTex, UNITY_PROJ_COORD(uv0))*0.8;
			//clip(o.Alpha-_clpCloud);

			half dpth = max(IN.screenPos.w,0.001)/500.0;
			//depth = 1-saturate(lerp(1.75,1.6,dpth)-lerp(1.25,1.0,_Tenkoku_shaderDepth));
			depth = 1-saturate(lerp(1.75,1.6,dpth)-lerp(1.25,1.0,_Tenkoku_shaderDepth)*0.7);

		}
		ENDCG
//##### END OVERCAST CLOUD #####






	} 
}

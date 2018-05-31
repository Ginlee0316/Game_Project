// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "TENKOKU/suneclipse_shader" {
 Properties 
 {
 _MainTex ("Base (RGB)", 2D) = "white" {}
 }
 

 
 Category {
	//Tags { "Queue"="Overlay+11" }
	Tags {"Queue"="Background-7"}
	Blend SrcAlpha OneMinusSrcAlpha
	Cull Back
	ZWrite Off
	Fog {Mode Off}
	Offset 1,981000

 	//Stencil {
	//	Ref 2
	//	Comp Greater
	//	Pass Replace 
	//	Fail Keep
	//	ZFail Replace
	//}

 	Stencil {
		Ref 2
		Comp Greater
		Pass Replace 
		Fail Keep
		ZFail Replace
	}
	
	SubShader {
		Pass {

			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			#pragma fragmentoption ARB_precision_hint_fastest nofog
			#include "UnityCG.cginc"

			sampler2D _MainTex;
			float tenkoku_eclipsefac;
			
			struct appdata_t {
				float4 vertex : POSITION;
				float4 color : COLOR;
				float2 texcoord : TEXCOORD0;
			};

			struct v2f {
				float4 vertex : POSITION;
				//float4 color : COLOR;
				float2 texcoord : TEXCOORD0;
			};
			
			float4 _MainTex_ST;

			v2f vert (appdata_t v) {
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				//o.color = v.color;
				o.texcoord = TRANSFORM_TEX(v.texcoord,_MainTex);
				return o;
			}

			half4 frag (v2f i) : COLOR {
				half4 tex = tex2D(_MainTex, i.texcoord);
				tex.a *= saturate(lerp(4.0,0.0,tenkoku_eclipsefac*1.75));
				return tex;// * 2.0;
			}
			ENDCG 
		}
	} 	



		
 
}
}
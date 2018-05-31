using System;
using UnityEngine;

namespace Tenkoku.Effects
{
    [ExecuteInEditMode]
    [RequireComponent (typeof(Camera))]
    [AddComponentMenu ("Image Effects/Tenkoku/Tenkoku Sun Shafts")]
    public class TenkokuSunShafts : MonoBehaviour
    {
        //public enum SuiSunShaftsResolution
        //{
         //   Low = 0,
         //   Normal = 1,
          //  High = 2,
        //}

       // public enum SuiShaftsScreenBlendMode
       // {
        //    Screen = 0,
        //    Add = 1,
       // }


        //public SuiSunShaftsResolution resolution = SuiSunShaftsResolution.Low;
        //public SuiShaftsScreenBlendMode screenBlendMode = SuiShaftsScreenBlendMode.Screen;

        public Transform sunTransform;
        public Color blockColor = new Color(0.74f,0.74f,0.74f,1.0f);
        public Color tintColor =  new Color(1f,1f,1f,0f);
        
        [HideInInspector]
        public Color sunColor = Color.white;
        public float sunShaftIntensity = 1.15f;
        public float maxRadius = 0.7f;
        public bool  useDepthTexture = true;

        private Material sunShaftsMaterial;
        private Camera camComponent;

        //public Shader useShader;


        void SetLightValues(String inVals){
            
            string[] vals = inVals.Split(","[0]);
            sunTransform = GameObject.Find(vals[0]).GetComponent<Transform>();
            sunColor.r = float.Parse(vals[1]) * 0.5f * float.Parse(vals[4]);
            sunColor.g = float.Parse(vals[2]) * 0.5f * float.Parse(vals[4]);
            sunColor.b = float.Parse(vals[3]) * 0.5f * float.Parse(vals[4]);
            sunShaftIntensity = float.Parse(vals[5]);

        }


        //var lightVals : String = sunlightObject.transform.name;
        //lightVals += ","+lightObjectWorld.color.r.ToString();
        //lightVals += ","+lightObjectWorld.color.g.ToString();
        //lightVals += ","+lightObjectWorld.color.b.ToString();
        //lightVals += ","+useSunRays? "1" : "0";
        //lightVals += ","+Mathf.Lerp(0.0,10.0,sunRayIntensity).ToString();
        //lightVals += ","+Mathf.Lerp(0.0,0.9,sunRayIntensity).ToString();


        void Start(){
            sunShaftsMaterial = new Material(Shader.Find("Hidden/TenkokuSunShafts"));
            camComponent = GetComponent<Camera>();
        }



        void OnRenderImage (RenderTexture source, RenderTexture destination) {


           camComponent.depthTextureMode |= DepthTextureMode.Depth;

            //divider = the resolution downsample amount (4= low, 2=mid, 1=high)
            int divider = 1;

            Vector3 v = Vector3.one * 0.5f;
            if (sunTransform)
                v = camComponent.WorldToViewportPoint(transform.position + (-sunTransform.forward * 100.0f));
            else
                v = new Vector3(1.0f, 0.5f, 0.0f);

            int rtW = source.width / divider;
            int rtH = source.height / divider;

            RenderTexture lrColorB;
            RenderTexture lrDepthBuffer = RenderTexture.GetTemporary (rtW, rtH, 0);

            // mask out everything except the skybox
            float sunShaftBlurRadius = 1.0f;
            sunShaftsMaterial.SetVector ("_BlurRadius4", new Vector4 (1.0f, 1.0f, 0.0f, 0.0f) * sunShaftBlurRadius );
            sunShaftsMaterial.SetVector ("_SunPosition", new Vector4 (v.x, v.y, v.z, maxRadius));

            //Blit depth buffer
            Graphics.Blit (source, lrDepthBuffer, sunShaftsMaterial, 2);


            // radial blur:
            float ofs = sunShaftBlurRadius * (1.0f / 768.0f);

            sunShaftsMaterial.SetVector ("_BlurRadius4", new Vector4 (ofs, ofs, 0.0f, 0.0f));
            sunShaftsMaterial.SetVector ("_SunPosition", new Vector4 (v.x, v.y, v.z, maxRadius));


            //set blur iterations explicitly
            int radialBlurIterations = 4;
            for (int it2 = 0; it2 < radialBlurIterations; it2++ ) {
                // each iteration takes 2 * 6 samples
                // we update _BlurRadius each time to cheaply get a very smooth look

                lrColorB = RenderTexture.GetTemporary (rtW, rtH, 0);
                Graphics.Blit (lrDepthBuffer, lrColorB, sunShaftsMaterial, 1);
                RenderTexture.ReleaseTemporary (lrDepthBuffer);
                ofs = sunShaftBlurRadius * (((it2 * 2.0f + 1.0f) * 6.0f)) / 768.0f;
                sunShaftsMaterial.SetVector ("_BlurRadius4", new Vector4 (ofs, ofs, 0.0f, 0.0f) );

                lrDepthBuffer = RenderTexture.GetTemporary (rtW, rtH, 0);
                Graphics.Blit (lrColorB, lrDepthBuffer, sunShaftsMaterial, 1);
                RenderTexture.ReleaseTemporary (lrColorB);
                ofs = sunShaftBlurRadius * (((it2 * 2.0f + 2.0f) * 6.0f)) / 768.0f;
                sunShaftsMaterial.SetVector ("_BlurRadius4", new Vector4 (ofs, ofs, 0.0f, 0.0f) );
            }

            // put together:
            if (v.z >= 0.0f)
                sunShaftsMaterial.SetVector ("_SunColor", new Vector4 (sunColor.r, sunColor.g, sunColor.b, sunColor.a) * sunShaftIntensity);
            else
                sunShaftsMaterial.SetVector ("_SunColor", Vector4.zero); //no backprojection !


            sunShaftsMaterial.SetVector ("_TintColor", new Vector4(tintColor.r, tintColor.g, tintColor.b, tintColor.a));



            sunShaftsMaterial.SetVector ("_ColorBlock", blockColor);
            sunShaftsMaterial.SetTexture ("_ColorBuffer", lrDepthBuffer);

            //force blit into first pass (screen mode)
            Graphics.Blit (source, destination, sunShaftsMaterial, 0);

            //release memory
            RenderTexture.ReleaseTemporary (lrDepthBuffer);







        }
    }
}

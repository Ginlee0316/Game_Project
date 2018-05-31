using System;
using UnityEngine;

namespace Tenkoku.Effects
{
    [ExecuteInEditMode]
    [RequireComponent (typeof(Camera))]
    [AddComponentMenu ("Image Effects/Tenkoku/Tenkoku Fog")]
    //class SuimonoFog : PostEffectsBase
    public class TenkokuSkyFog : MonoBehaviour
	{



        public bool  useRadialDistance = true;
        public bool  fogHorizon = false;
        public bool  fogSkybox = true;

        [Tooltip("Fog top Y coordinate")]
        public float height = 185.0f;

        [Range(0.00001f,10.0f)]
        public float heightDensity = 0.00325f;

        public Color fogColor = new Color(1.0f,1.0f,1.0f,1.0f);


        public Texture distortTex = null;

        //public float heatAmt = 0.015f;
        public float heatSpd = 4.0f;
        public float heatScale = 2.0f;
        public float heatDistance = 0.01f;

        public Shader fogShader = null;

        private Material fogMaterial = null;
        private RenderTexture fogRender = null;


        void Start(){
            fogShader = Shader.Find("TENKOKU/TenkokuFog");
            fogMaterial = new Material(fogShader);
            distortTex = Resources.Load("textures/tex_distortion") as Texture;
        }


        [ImageEffectOpaque]
        void OnRenderImage (RenderTexture source, RenderTexture destination)
		{
            //get render color
            //Transform renderObject = transform.parent.Find("Suimono_Object");
            //fogColor = renderObject.GetComponent<Renderer>().material.GetColor("_DepthColorB");

            Camera cam = GetComponent<Camera>();
            Transform camtr = cam.transform;
            float camNear = cam.nearClipPlane;
            float camFar = cam.farClipPlane;
            float camFov = cam.fieldOfView;
            float camAspect = cam.aspect;

            Matrix4x4 frustumCorners = Matrix4x4.identity;

            float fovWHalf = camFov * 0.5f;

            Vector3 toRight = camtr.right * camNear * Mathf.Tan (fovWHalf * Mathf.Deg2Rad) * camAspect;
            Vector3 toTop = camtr.up * camNear * Mathf.Tan (fovWHalf * Mathf.Deg2Rad);

            Vector3 topLeft = (camtr.forward * camNear - toRight + toTop);
            float camScale = topLeft.magnitude * camFar/camNear;

            topLeft.Normalize();
            topLeft *= camScale;

            Vector3 topRight = (camtr.forward * camNear + toRight + toTop);
            topRight.Normalize();
            topRight *= camScale;

            Vector3 bottomRight = (camtr.forward * camNear + toRight - toTop);
            bottomRight.Normalize();
            bottomRight *= camScale;

            Vector3 bottomLeft = (camtr.forward * camNear - toRight - toTop);
            bottomLeft.Normalize();
            bottomLeft *= camScale;

            frustumCorners.SetRow (0, topLeft);
            frustumCorners.SetRow (1, topRight);
            frustumCorners.SetRow (2, bottomRight);
            frustumCorners.SetRow (3, bottomLeft);

            var camPos= camtr.position;
            float FdotC = camPos.y-height;
            float paramK = (FdotC <= 0.0f ? 1.0f : 0.0f);
            fogMaterial.SetMatrix ("_FrustumCornersWS", frustumCorners);
            fogMaterial.SetVector ("_CameraWS", camPos);
            fogMaterial.SetVector ("_HeightParams", new Vector4 (height, FdotC, paramK, heightDensity*0.5f));
            fogMaterial.SetVector ("_DistanceParams", new Vector4 (-Mathf.Max(0.0f,0.0f), 0, 0, 0));

            fogMaterial.SetColor ("_FogColor", fogColor);
            //fogMaterial.SetFloat ("_FogDistance", 1.0f-fogSpread);
            //fogMaterial.SetFloat ("_FogStart", 0.0f-(fogStart/cam.farClipPlane));
            fogMaterial.SetFloat ("_camDistance", cam.farClipPlane);

            //get child camera and fog texture and send to shader
            fogRender = GameObject.Find("Tenkoku_SkyFog").GetComponent<Camera>().targetTexture;
            if (fogRender != null){
                fogMaterial.SetTexture ("_SkyTex", fogRender);
                Shader.SetGlobalTexture ("_Tenkoku_SkyTex", fogRender);
            }


            var sceneMode= RenderSettings.fogMode;
            var sceneDensity= RenderSettings.fogDensity;
            //var sceneStart= RenderSettings.fogStartDistance;
            //var sceneEnd= RenderSettings.fogEndDistance;


            Vector4 sceneParams;

            sceneParams.x = sceneDensity * 1.2011224087f;
            sceneParams.y = sceneDensity * 1.4426950408f;
            sceneParams.z = 0.0f;
            sceneParams.w = 0.0f;

            fogMaterial.SetVector ("_SceneFogParams", sceneParams);
            fogMaterial.SetVector ("_SceneFogMode", new Vector4((int)sceneMode, useRadialDistance ? 1 : 0, 0, 0));


            //set skybox fog
            fogMaterial.SetFloat ("_fogSkybox", fogSkybox ? 0.0f : 1.0f);
            
            //set horizon fog
            fogMaterial.SetFloat ("_fogHorizon",  fogHorizon ? 1.0f : 0.0f);

            //Heat Distortion Effect
            if (distortTex != null){
                fogMaterial.SetTexture("_HeatDistortText",distortTex);
                //fogMaterial.SetFloat("_HeatDistortAmt",heatAmt);
                fogMaterial.SetFloat("_HeatDistortSpeed",heatSpd);
                fogMaterial.SetFloat("_HeatDistortScale",heatScale);
                fogMaterial.SetFloat("_HeatDistortDist",heatDistance);
            }



            CustomGraphicsBlit (source, destination, fogMaterial, 0);
            //Graphics.Blit(source, destination, fogMaterial, pass);


        }

        static void CustomGraphicsBlit (RenderTexture source, RenderTexture dest, Material fxMaterial, int passNr)
		{
            

            RenderTexture.active = dest;

            fxMaterial.SetTexture ("_MainTex", source);

            GL.PushMatrix ();
            GL.LoadOrtho ();

            fxMaterial.SetPass (passNr);

            GL.Begin (GL.QUADS);

            GL.MultiTexCoord2 (0, 0.0f, 0.0f);
            GL.Vertex3 (0.0f, 0.0f, 3.0f); // BL

            GL.MultiTexCoord2 (0, 1.0f, 0.0f);
            GL.Vertex3 (1.0f, 0.0f, 2.0f); // BR

            GL.MultiTexCoord2 (0, 1.0f, 1.0f);
            GL.Vertex3 (1.0f, 1.0f, 1.0f); // TR

            GL.MultiTexCoord2 (0, 0.0f, 1.0f);
            GL.Vertex3 (0.0f, 1.0f, 0.0f); // TL

            GL.End ();
            GL.PopMatrix ();
            
        }
    }
}

#pragma strict


var iterations : int = 3;
var blurSpread : float = 0.6f;
var blurShader : Shader = null;
var material : Material = null;


function Start(){

    if (material == null) {
       material = new Material(blurShader);
        material.hideFlags = HideFlags.DontSave;
    }

    // Disable if we don't support image effects
    if (!SystemInfo.supportsImageEffects) {
        enabled = false;
        return;
    }
    // Disable if the shader can't run on the users graphics card
    if (!blurShader || !material.shader.isSupported) {
        enabled = false;
        return;
    }
}




// Performs one blur iteration.
function FourTapCone (source : RenderTexture, dest : RenderTexture, iteration : int){
    var off : float = 0.5f + iteration*blurSpread;
    Graphics.BlitMultiTap (source, dest, material,
                           new Vector2(-off, -off),
                           new Vector2(-off,  off),
                           new Vector2( off,  off),
                           new Vector2( off, -off)
        );
}

// Downsamples the texture to a quarter resolution.
function DownSample4x (source : RenderTexture, dest : RenderTexture){
    var off : float = 1.0f;
    Graphics.BlitMultiTap (source, dest, material,
                           new Vector2(-off, -off),
                           new Vector2(-off,  off),
                           new Vector2( off,  off),
                           new Vector2( off, -off)
        );
}

// Called by the camera to apply the image effect
function OnRenderImage (source : RenderTexture, destination : RenderTexture) {
    var rtW : int = source.width/4;
    var rtH : int = source.height/4;
    var buffer : RenderTexture = RenderTexture.GetTemporary(rtW, rtH, 0);

    // Copy source to the 4x4 smaller texture.
    DownSample4x (source, buffer);

    // Blur the small texture
    for(var i : int = 0; i < iterations; i++)
    {
        var buffer2 : RenderTexture = RenderTexture.GetTemporary(rtW, rtH, 0);
        FourTapCone (buffer, buffer2, i);
        RenderTexture.ReleaseTemporary(buffer);
        buffer = buffer2;
    }
    Graphics.Blit(buffer, destination);

    RenderTexture.ReleaseTemporary(buffer);
}



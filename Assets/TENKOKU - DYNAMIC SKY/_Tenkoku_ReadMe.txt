---------------------------------------------------
TENKOKU - DYNAMIC SKY

Copyright ©2016 Tanuki Digital
Version 1.0.9b
---------------------------------------------------


----------------------------
THANK YOU FOR YOUR PURCHASE!
----------------------------
Thank you for buying TENKOKU and supporting Tanuki Digital!
It's people like you that allow us to build and improve our software! 
if you have any questions, comments, or requests for new features
please visit the Tanuki Digital Forums and post your feedback:

http://tanukidigital.com/forum/

or email us directly at: konnichiwa@tanukidigital.com



----------------------
REGISTER YOUR PURCHASE
----------------------
Did you purchase Tenkoku - Dynamic Sky on the Unity Asset Store?
Registering at Tanuki Digital.com gives you immediate access to new downloads, updates, and exclusive content as well as Tenkoku and Tanuki Digital news and info.  Fill out the registration forum using your Asset Store "OR" Order Number here:

http://www.tanukidigital.com/tenkoku/index.php?register=1



----------------------
SUPPORT
----------------------
If you have questions about Tenkoku, need help with a feature, or think you've identified a bug please let us know either in the Unity forum or on the Tanuki Digital forum below.

Unity Forum Thread: http://forum.unity3d.com/threads/tenkoku-dynamic-sky.318166/
Tanuki Digital Forum: http://tanukidigital.com/forum/

You can also email us directly at: konnichiwa@tanukidigital.com



----------------------
DOCUMENTATION
----------------------
Please read the Tenkoku documentation files for more in-depth customization information.
http://tanukidigital.com/tenkoku/documentation



-------------
INSTALLATION
-------------
I. IMPORT TENKOKU FILES INTO YOUR PROJCT
Go to: “Assets -> Import Package -> Custom Package...” in the Unity Menu and select the “tenkoku_dynamicsky_ver1.x.unitypackage” file. This will open an import dialog box. Click the import button and all the Tenkoku files will be imported into your project list.

II. ADD THE TENKOKU MODULE TO YOUR SCENE
1) Drag the Tenkoku DynamicSky prefab located in the “/PREFABS” folder into your scene list.
2) If it isn’t set already, make sure to set the Tenkoku DynamicSky’s position in the transform settings to 0,0,0

III. ADD TENKOKU EFFECTS TO YOUR CAMERA
1) Click on your main camera object and add the Tenkoku Fog effect by going to Component-->Image Effects-->Tenkoku-->Tenkoku Fog.
Note: For best results this effect should be placed to render BEFORE your Tonemapping effect(if applicable).

(optional)
2) Click on your main camera object and add the Tenkoku Sun Shaft effect by going to Component-->Image Effects-->Tenkoku-->Tenkoku Sun Shafts.
Note: For best results this effect should be placed to render AFTER your Tonemapping effect(if applicable).


A Note About Scene Cameras:
Tenkoku relies on tracking your main scene camera in order to properly update in the scene.  By default Tenkoku attempts to auto locate your camera by selecting the camera in your scene with the ‘MainCamera’ tag.  Alternatively you can set it to manual mode and drag the appropriate camera into the ‘Scene Camera’ slot.




-------------
NOTES
-------------
A Note On Accuracy:
Moon and planet position calculations are currently accurate for years ranging between 1900ca - 2100ca.  The further away from the year 2000ca that you get (in either direction) the more noticeable calculation errors will become.  Additional calculation methods are currently being looked at to increase the accuracy range for these objects.



-------------------------------
RELEASE NOTES - Version 1.0.9b
-------------------------------
BUG FIXES
- Fixed overcast clouds not  responding to day/night lighting.
- Moon lighting now respects overcast setting.
- Force disable autotime while scene is not playing.



----------------------------
CREDITS
----------------------------
- Lunar image adapted from texture work by James Hastings-Trew.  Used with Permission.
http://planetpixelemporium.com

- Galaxy image adapted from an open source image made available by the European Southern Observatory(ESO/S. Brunier):
https://www.eso.org/public/usa/images/eso0932a/

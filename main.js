var canvas;
var gl;

var program;

var near = 1;
var far = 100;


var left = -6.0;
var right = 6.0;
var ytop = 6.0;
var bottom = -6.0;


// projection variables
var fovy = 60;
var aspect = 1
let usePerspectiveProjection = true


var lightPosition2 = vec4(100.0, 100.0, 100.0, 1.0 );
var lightPosition = vec4(0.0, 0.0, 100.0, 1.0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 0.1, 0.1, 0.1, 1.0 );
var materialShininess = 30.0;
// var materialSpecular = vec4( 0.4, 0.4, 0.4, 1.0 );
// var materialShininess = 50.0;

var ambientColor, diffuseColor, specularColor;

var modelMatrix, viewMatrix, modelViewMatrix, projectionMatrix, normalMatrix;
var modelViewMatrixLoc, projectionMatrixLoc, normalMatrixLoc;
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var RX = 0;
var RY = 0;
var RZ = 0;

var MS = []; // The modeling matrix stack
var TIME = 0.0; // Realtime
var dt = 0.0
var prevTime = 0.0;
var resetTimerFlag = true;
var animFlag = true;
var controller;

// These are used to store the current state of objects.

// Stadium
const stadiumColor = vec4(0.051, 0.133, 0.255, 1.0);
var earthquake = [0,0,0];
var CSStadium = [0,-1,0];
var stadiumBaseScaling = [8,1,8];
var stadiumBasePosition = [0,-1,0];
var battleTextColor = vec4(1,1,1,1.0);
var CSBattleText = [8.1,0,0];
var battleTextScaling = [0.1,8*491/1491,8];
var battleTextPosition = [0,-1,0];
var CSCorner = [0,0,-8.1];
var cornerScaling = [0.1,8*491/1491,0.1];
var cornerPosition = [0,-1,0];

// Mew
const mewColor = vec4(0.9686, 0.7216, 0.8118, 1.0);
var mewTranslation = [0,0,0]
const mewHeadColor = vec4(0,0,0, 1.0);
var CSMewHead = [-5.5,6,5.5];
var mewHeadScaling = [1,0.8,1.3];
var mewHeadPosition = [0,0,0];
var CSMewFace = [1,0,0];
var mewFaceScaling = [0.01,0.5,1];
var mewFacePosition = [0,0,0];
var mewFaceRotation = [0,0,0];
var CSMewEars = [0,0.8,0.9];
var mewEarsScaling = [0.5,0.5,0.5];
var mewEarsRotation = [-50,1,0,0];
var mewEarsPosition = [0,0,0];
const mewAntennaColor = vec4(0.75, 0.75, 0.75,1.0);
var CSMewAntennaBase = [0,0.6,0];
var mewAntennaBaseScaling = [0.4,0.4,0.4];
var mewAntennaBasePosition = [0,0,0];
var mewAntennaScaling = [0.05,1,0.05];
var mewAntennaPosition = [0,1,0];
const mewEyesColor = vec4(1,1,1,1);
var CSMewEyes = [0.45,0,0.5];
var mewEyesScaling = [0.5,0.6,0.5];
var mewEyesPosition = [0,0,0];
var CSMewPupils = [0,0,0];
var mewPupilsScaling = [1,1,1];
var mewPupilsPosition = [0,0,0];
var CSMewBody = [0,-0.8*mewHeadScaling[1],0];
var mewBodyScaling = [1,1.5,1];
var mewBodyPosition = [0,-1,0];
var CSMewArms = [1,-0.5*mewBodyScaling[1],0.5];
var mewArmsScaling = [0.25,-0.5,0.25];
var mewArmsPosition = [0,0,0];
var mewArmsRotation = [0,0,0];
var CSMewThigh = [0.5,-1.6*mewBodyScaling[1],0.7];
var mewThighScaling = [0.5,1,0.5];
var mewThighPosition = [0,0,0];
var mewThighRotation = [0,0,0];
var CSMewFoot = [-0.9,-1.1*mewThighScaling[1],0];
var mewFootScaling = [0.25,0.8,0.3];
var mewFootPosition = [0,0,0];
var CSMewSole = [-0.05,0,0];
const mewSoleColor = vec4(0.7,0.5,0.3,1.0);
var mewSoleScaling = [0.25,0.4,0.15];
var mewSolePosition = [0,0,0];

// Button
const buttonBaseColor = vec4(0,0,0,1.0); //black
var CSButtonBase = [6,0,-6];
var buttonBaseScaling = [2,0.5,2];
var buttonBasePosition = [0,-1,0];
const buttonColor = vec4(1,0,0,1.0); //red
var buttonPress = [0,0,0];
var buttonPressed = 0;
var CSButton = [0,0,0];
var buttonScaling = [2,1,2];
var buttonPosition = [0,0,0];

// variables used for scene
var scene = 1;
var useTextures = 0;
var mewFace = 0;

// variables used for FPS
let frames = 0;
let lastUpdateTime = 0;
		
var textureArray = [] ;

// Setting the colour which is needed during illumination of a surface
function setColor(c)
{
    ambientProduct = mult(lightAmbient, c) ;
    diffuseProduct = mult(lightDiffuse, c);
    specularProduct = mult(lightSpecular, materialSpecular);
    
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "lightPosition"),flatten(lightPosition2) );
    gl.uniform1f( gl.getUniformLocation(program, 
                                        "shininess"),materialShininess );
}

// We are going to asynchronously load actual image files this will check if that call if an async call is complete
// You can use this for debugging
function isLoaded(im) {
    if (im.complete) {
        console.log("loaded") ;
        return true ;
    }
    else {
        console.log("still not loaded!!!!") ;
        return false ;
    }
}

// Helper function to load an actual file as a texture
// NOTE: The image is going to be loaded asyncronously (lazy) which could be
// after the program continues to the next functions. OUCH!
function loadFileTexture(tex, filename)
{
	//create and initalize a webgl texture object.
    tex.textureWebGL  = gl.createTexture();
    tex.image = new Image();
    tex.image.src = filename ;
    tex.isTextureReady = false ;
    tex.image.onload = function() { handleTextureLoaded(tex); }
}

// Once the above image file loaded with loadFileTexture is actually loaded,
// this function is the onload handler and will be called.
function handleTextureLoaded(textureObj) {
	//Binds a texture to a target. Target is then used in future calls.
		//Targets:
			// TEXTURE_2D           - A two-dimensional texture.
			// TEXTURE_CUBE_MAP     - A cube-mapped texture.
			// TEXTURE_3D           - A three-dimensional texture.
			// TEXTURE_2D_ARRAY     - A two-dimensional array texture.
    gl.bindTexture(gl.TEXTURE_2D, textureObj.textureWebGL);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // otherwise the image would be flipped upsdide down
	
	//texImage2D(Target, internalformat, width, height, border, format, type, ImageData source)
    //Internal Format: What type of format is the data in? We are using a vec4 with format [r,g,b,a].
        //Other formats: RGB, LUMINANCE_ALPHA, LUMINANCE, ALPHA
    //Border: Width of image border. Adds padding.
    //Format: Similar to Internal format. But this responds to the texel data, or what kind of data the shader gets.
    //Type: Data type of the texel data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureObj.image);
	
	//Set texture parameters.
    //texParameteri(GLenum target, GLenum pname, GLint param);
    //pname: Texture parameter to set.
        // TEXTURE_MAG_FILTER : Texture Magnification Filter. What happens when you zoom into the texture
        // TEXTURE_MIN_FILTER : Texture minification filter. What happens when you zoom out of the texture
    //param: What to set it to.
        //For the Mag Filter: gl.LINEAR (default value), gl.NEAREST
        //For the Min Filter: 
            //gl.LINEAR, gl.NEAREST, gl.NEAREST_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR (default value), gl.LINEAR_MIPMAP_LINEAR.
    //Full list at: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
	
	//Generates a set of mipmaps for the texture object.
        /*
            Mipmaps are used to create distance with objects. 
        A higher-resolution mipmap is used for objects that are closer, 
        and a lower-resolution mipmap is used for objects that are farther away. 
        It starts with the resolution of the texture image and halves the resolution 
        until a 1x1 dimension texture image is created.
        */
    gl.generateMipmap(gl.TEXTURE_2D);
	
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
    gl.bindTexture(gl.TEXTURE_2D, null);
    console.log(textureObj.image.src) ;
    
    textureObj.isTextureReady = true ;
}

// Takes an array of textures and calls render if the textures are created/loaded
// This is useful if you have a bunch of textures, to ensure that those files are
// actually laoded from disk you can wait and delay the render function call
// Notice how we call this at the end of init instead of just calling requestAnimFrame like before
function waitForTextures(texs) {
    setTimeout(
		function() {
			   var n = 0 ;
               for ( var i = 0 ; i < texs.length ; i++ )
               {
                    console.log(texs[i].image.src) ;
                    n = n+texs[i].isTextureReady ;
               }
               wtime = (new Date()).getTime() ;
               if( n != texs.length )
               {
               		console.log(wtime + " not ready yet") ;
               		waitForTextures(texs) ;
               }
               else
               {
               		console.log("ready to render") ;
					render(0);
               }
		},
	5) ;
}

// This will use an array of existing image data to load and set parameters for a texture
// We'll use this function for procedural textures, since there is no async loading to deal with
function loadImageTexture(tex, image) {
	//create and initalize a webgl texture object.
    tex.textureWebGL  = gl.createTexture();
    tex.image = new Image();

	//Binds a texture to a target. Target is then used in future calls.
		//Targets:
			// TEXTURE_2D           - A two-dimensional texture.
			// TEXTURE_CUBE_MAP     - A cube-mapped texture.
			// TEXTURE_3D           - A three-dimensional texture.
			// TEXTURE_2D_ARRAY     - A two-dimensional array texture.
    gl.bindTexture(gl.TEXTURE_2D, tex.textureWebGL);

	//texImage2D(Target, internalformat, width, height, border, format, type, ImageData source)
    //Internal Format: What type of format is the data in? We are using a vec4 with format [r,g,b,a].
        //Other formats: RGB, LUMINANCE_ALPHA, LUMINANCE, ALPHA
    //Border: Width of image border. Adds padding.
    //Format: Similar to Internal format. But this responds to the texel data, or what kind of data the shader gets.
    //Type: Data type of the texel data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
	
	//Generates a set of mipmaps for the texture object.
        /*
            Mipmaps are used to create distance with objects. 
        A higher-resolution mipmap is used for objects that are closer, 
        and a lower-resolution mipmap is used for objects that are farther away. 
        It starts with the resolution of the texture image and halves the resolution 
        until a 1x1 dimension texture image is created.
        */
    gl.generateMipmap(gl.TEXTURE_2D);
	
	//Set texture parameters.
    //texParameteri(GLenum target, GLenum pname, GLint param);
    //pname: Texture parameter to set.
        // TEXTURE_MAG_FILTER : Texture Magnification Filter. What happens when you zoom into the texture
        // TEXTURE_MIN_FILTER : Texture minification filter. What happens when you zoom out of the texture
    //param: What to set it to.
        //For the Mag Filter: gl.LINEAR (default value), gl.NEAREST
        //For the Min Filter: 
            //gl.LINEAR, gl.NEAREST, gl.NEAREST_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR (default value), gl.LINEAR_MIPMAP_LINEAR.
    //Full list at: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); //Prevents s-coordinate wrapping (repeating)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT); //Prevents t-coordinate wrapping (repeating)
    gl.bindTexture(gl.TEXTURE_2D, null);

    tex.isTextureReady = true;
}

// This calls the appropriate texture loads for the scenes and puts the textures in an array
function initTextures() {
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"assets/floor.png") ;
    
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"assets/face1.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"assets/face2.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"assets/face3.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"assets/face4.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"assets/face5.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"assets/face6.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"assets/face7.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"assets/battle_text1.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"assets/battle_text2.png") ;

    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"assets/battle_text3.png") ;
}

// Turn texture use on and off
function toggleTextures() {
    useTextures = (useTextures + 1) % 2
	gl.uniform1i(gl.getUniformLocation(program, "useTextures"), useTextures);
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    // gl.clearColor( 0.051, 0.133, 0.255, 1.0 );
    gl.clearColor(1.0, 0.9804, 0.9529, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" ); //one shader program
    gl.useProgram( program );
    

    setColor(materialDiffuse);
	
	// Initialize some shapes, note that the curved ones are procedural which allows you to parameterize how nice they look
	// Those number will correspond to how many sides are used to "estimate" a curved surface. More = smoother
    Cube.init(program);
    Cylinder.init(20,program);
    Cone.init(20,program);
    Sphere.init(36,program);

    // Matrix uniforms
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    
    // Lighting Uniforms
    gl.uniform4fv( gl.getUniformLocation(program, 
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, 
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
       "shininess"),materialShininess );
	
	// Helper function to load the set of textures
    initTextures() ;
    
    document.getElementById("animToggleButton").onclick = function() {
        if( animFlag ) {
            animFlag = false;
        }
        else {
            animFlag = true;
            resetTimerFlag = true;
            window.requestAnimFrame(render);
        }
		
		controller = new CameraController(canvas);
		controller.onchange = function(xRot,yRot) {
			RX = xRot;
			RY = yRot;
			window.requestAnimFrame(render); };
    };
    const fovyContainer = document.getElementById("fovyContainer");
    fovyContainer.style.display = usePerspectiveProjection ? "block" : "none";

    document.getElementById("perspectiveToggleButton").onclick = function () {
        usePerspectiveProjection = !usePerspectiveProjection; // Toggle perspective projection
        const fovyContainer = document.getElementById("fovyContainer");
        const perspectiveToggleButton = document.getElementById("perspectiveToggleButton");
        
        if (usePerspectiveProjection) {
            perspectiveToggleButton.value = "Toggle Projection (Orthographic)";
            fovyContainer.style.display = "block"; // Show the slider
        } else {
            perspectiveToggleButton.value = "Toggle Projection (Perspective)";
            fovyContainer.style.display = "none"; // Hide the slider
        }
    };
    waitForTextures(textureArray);
}

// Sets the modelview and normal matrix in the shaders
function setMV() {
    modelViewMatrix = mult(viewMatrix,modelMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    normalMatrix = inverseTranspose(modelViewMatrix);
    gl.uniformMatrix4fv(normalMatrixLoc, false, flatten(normalMatrix) );
}

// Sets the projection, modelview and normal matrix in the shaders
function setAllMatrices() {
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    setMV();   
}

// Draws a 2x2x2 cube center at the origin
// Sets the modelview matrix and the normal matrix of the global program
// Sets the attributes and calls draw arrays
function drawCube() {
    setMV();
    Cube.draw();
}

// Draws a sphere centered at the origin of radius 1.0.
// Sets the modelview matrix and the normal matrix of the global program
// Sets the attributes and calls draw arrays
function drawSphere() {
    setMV();
    Sphere.draw();
}

// Draws a cylinder along z of height 1 centered at the origin
// and radius 0.5.
// Sets the modelview matrix and the normal matrix of the global program
// Sets the attributes and calls draw arrays
function drawCylinder() {
    setMV();
    Cylinder.draw();
}

// Draws a cone along z of height 1 centered at the origin
// and base radius 1.0.
// Sets the modelview matrix and the normal matrix of the global program
// Sets the attributes and calls draw arrays
function drawCone() {
    setMV();
    Cone.draw();
}

// Post multiples the modelview matrix with a translation matrix
// and replaces the modeling matrix with the result
function gTranslate(x,y,z) {
    modelMatrix = mult(modelMatrix,translate([x,y,z]));
}

// Post multiples the modelview matrix with a rotation matrix
// and replaces the modeling matrix with the result
function gRotate(theta,x,y,z) {
    modelMatrix = mult(modelMatrix,rotate(theta,[x,y,z]));
}

// Post multiples the modelview matrix with a scaling matrix
// and replaces the modeling matrix with the result
function gScale(sx,sy,sz) {
    modelMatrix = mult(modelMatrix,scale(sx,sy,sz));
}

// Pops MS and stores the result as the current modelMatrix
function gPop() {
    modelMatrix = MS.pop();
}

// pushes the current modelViewMatrix in the stack MS
function gPush() {
    MS.push(modelMatrix);
}
//----------------------------------------------------------------------------
//
//  Helper functions
//

// Function that applies the 360 fly around to eye, and returns it
function flyAround360(radius, angle, height) {
    const cameraX = radius * Math.cos(angle);
    const cameraZ = radius * Math.sin(angle);
    const cameraY = height;
    eye = vec3(cameraX, cameraY, cameraZ);

    return eye
}

// Function that draws the axis at the origin of the current system. Very helpful for debugging
function drawAxis() {
	gPush();
		gPush();
		{ //Draw X-axis
			setColor(vec4(1,0,0,1.0));
			gScale(5,0.01,0.01)
			drawCube();
		}
		gPop();
		gPush();
		{ //Draw Y-axis
			setColor(vec4(0,1,0,1.0));
			gScale(0.01,5,0.01)
			drawCube();
		}
		gPop();
		gPush();
		{ //Draw Z-axis
			setColor(vec4(0,0,1,1.0));
			gScale(0.005,0.005,3)
			drawCube();
		}
		gPop();
	gPop();
	
}

// Function that draws the stadium
function drawStadium(timestamp) {
    if (scene == 3) {
        earthquake[0] = 1*Math.cos(0.0275*timestamp);
        gTranslate(earthquake[0], earthquake[1], earthquake[2]);
    }
    gPush();
        // Create CSStadium
        gTranslate(CSStadium[0],CSStadium[1],CSStadium[2]);
        setColor(stadiumColor);

        gPush();
        { // Draw Segment (stadium base) in CSStadium
            gScale(stadiumBaseScaling[0],stadiumBaseScaling[1],stadiumBaseScaling[2]);
			gTranslate(stadiumBasePosition[0],stadiumBasePosition[1],stadiumBasePosition[2]);
            toggleTextures();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textureArray[0].textureWebGL);
            gl.uniform1i(gl.getUniformLocation(program, "curtexture"), 0);
            drawCube();
            toggleTextures();
        }
        gPop();
        drawBattleText();
    gPop();
}

// Function that draws the battle text in the sides of the stadium
function drawBattleText() {
    setColor(battleTextColor);
    toggleTextures();
    gl.activeTexture(gl.TEXTURE0);
    if (scene == 1) {
        gl.bindTexture(gl.TEXTURE_2D, textureArray[8].textureWebGL);
    } else if (scene == 2 || scene == 3 || scene == 4 || scene == 5 ) {
        gl.bindTexture(gl.TEXTURE_2D, textureArray[9].textureWebGL);
    } else {
        gl.bindTexture(gl.TEXTURE_2D, textureArray[10].textureWebGL);
    }
    gl.uniform1i(gl.getUniformLocation(program, "curtexture"), 0);
    gPush();
    { // face1
        gTranslate(CSBattleText[0],0,0);
        drawLimb("cube",battleTextScaling,battleTextPosition);
        gTranslate(CSCorner[0],CSCorner[1],CSCorner[2]);
        drawLimb("cube",cornerScaling,cornerPosition);
    }
    gPop();
    setColor(battleTextColor);
    gPush();
    { // face2
        gTranslate(-CSBattleText[0],0,0);
        drawLimb("cube",battleTextScaling,battleTextPosition);
        gTranslate(CSCorner[0],CSCorner[1],-CSCorner[2]);
        drawLimb("cube",cornerScaling,cornerPosition);
    }
    gPop();
    setColor(battleTextColor);
    gPush();
    { // face3
        gTranslate(0,0,CSBattleText[0]);
        gRotate(90,0,1,0);
        drawLimb("cube",battleTextScaling,battleTextPosition);
        gTranslate(CSCorner[0],CSCorner[1],-CSCorner[2]);
        drawLimb("cube",cornerScaling,cornerPosition);
    }
    gPop();
    setColor(battleTextColor);
    gPush();
    { // face4
        gTranslate(0,0,-CSBattleText[0]);
        gRotate(90,0,1,0);
        drawLimb("cube",battleTextScaling,battleTextPosition);
        gTranslate(CSCorner[0],CSCorner[1],CSCorner[2]);
        drawLimb("cube",cornerScaling,cornerPosition);
    }
    gPop();
    toggleTextures();
}

// Helper Function that draws the limbs, taking measurements and primitive shape as arguments
function drawLimb(primitiveShape, limbScaling, limbPosition) {
	gPush();
	{ // Draw Segment (limb) in CSLimb
		gScale(limbScaling[0],limbScaling[1],limbScaling[2]);
		gTranslate(limbPosition[0],limbPosition[1],limbPosition[2]); // returns shape to being directly under origin
        if (primitiveShape == "sphere") {
            drawSphere();
        } else if (primitiveShape == "cone") {
            drawCone();
        } else {
            drawCube();
        }
	}
	gPop();
}

// Functions that draw mew
// --- mew start ---
function drawMew(timestamp) {
    gPush();
        // Create CSMewHead
        mewTranslation[0] = 1*Math.cos(0.00275*timestamp);
		mewTranslation[1] = 1*Math.cos(0.00275*timestamp);
		gTranslate(mewTranslation[0], mewTranslation[1], mewTranslation[2]);
        gTranslate(CSMewHead[0],CSMewHead[1],CSMewHead[2]);
        gRotate(45,0,1,0);

        setColor(mewColor);

        gPush();
        { // Draw Segment (mew head) in CSMewHead
            setColor(mewHeadColor)
            gScale(mewHeadScaling[0],mewHeadScaling[1],mewHeadScaling[2]);
			gTranslate(mewHeadPosition[0],mewHeadPosition[1],mewHeadPosition[2]); // returns shape to being directly under origin
            drawCube();
        }
        gPop();
        setColor(mewColor);
        drawMewFace(timestamp);
        drawMewEars();
        drawMewAntenna();
        drawMewEyes("right");
        drawMewEyes("left");
        // Create CSMewBody
        setColor(mewColor);
        gTranslate(CSMewBody[0],CSMewBody[1],CSMewBody[2]);
        drawLimb("sphere", mewBodyScaling, mewBodyPosition);
        drawMewArms("right", timestamp);
        drawMewArms("left", timestamp);
        drawMewLegs("right", timestamp);
        setColor(mewColor);
        drawMewLegs("left", timestamp);

    gPop();
}

function drawMewFace(timestamp) {
    const mewFaceLocation = gl.getUniformLocation(program, 'mewFace');
    gPush();
    {
    gTranslate(CSMewFace[0],CSMewFace[1],CSMewFace[2]);
    facenumber = Math.floor(timestamp % 7000 / 1000) + 1
    toggleTextures();
    gl.activeTexture(gl.TEXTURE0);
    if (scene == 2) {
        gl.bindTexture(gl.TEXTURE_2D, textureArray[1].textureWebGL);
    } else if (scene == 3) {
        gl.bindTexture(gl.TEXTURE_2D, textureArray[2].textureWebGL);
    } else if (scene == 4) {
        gl.bindTexture(gl.TEXTURE_2D, textureArray[1].textureWebGL);
    } else if (scene == 5) {
        gl.bindTexture(gl.TEXTURE_2D, textureArray[3].textureWebGL);
    } else if (scene == 6) {
        gl.bindTexture(gl.TEXTURE_2D, textureArray[1].textureWebGL);
    } else if (scene == 7) {
        gl.bindTexture(gl.TEXTURE_2D, textureArray[4].textureWebGL);
    } else {
        gl.bindTexture(gl.TEXTURE_2D, textureArray[facenumber].textureWebGL);
    }
    mewFace = 1;
    gl.uniform1i(mewFaceLocation, mewFace);
    gl.uniform1i(gl.getUniformLocation(program, "curtexture"), 0);
    drawLimb("cube", mewFaceScaling, mewFacePosition);
    toggleTextures();
    mewFace = 0;
    gl.uniform1i(mewFaceLocation, mewFace);
    }
    gPop();
}

function drawMewEars() {
    gPush();
        gPush();
        { //Create CSMewEars, which will be popped later since the rest of mew will be built under the head not ears
            gTranslate(CSMewEars[0],CSMewEars[1],CSMewEars[2]);
            gRotate(-50,1,0,0);
            drawLimb("cone", mewEarsScaling, mewEarsPosition);
        }
        gPop();
        gPush();
        { //Create CSMewEarsLeft, which will be popped later since the rest of mew will be built under the head not ears
            gTranslate(CSMewEars[0],CSMewEars[1],-CSMewEars[2]);
            gRotate(230,1,0,0);
            drawLimb("cone", mewEarsScaling, mewEarsPosition);
        }
        gPop();
    gPop();
}

function drawMewAntenna() {
    gPush();
        setColor(mewAntennaColor)
        gPush();
        { //Create CSMewEars, which will be popped later since the rest of mew will be built under the head not ears
            gTranslate(CSMewAntennaBase[0],CSMewAntennaBase[1],CSMewAntennaBase[2]);
            drawLimb("sphere", mewAntennaBaseScaling, mewAntennaBasePosition);
        }
        gPush();
        {
            gRotate(25,1,0,0);
            drawLimb("sphere", mewAntennaScaling, mewAntennaPosition);
        }
        gPop();
        gPush();
        {
            gRotate(-25,1,0,0);
            drawLimb("sphere", mewAntennaScaling, mewAntennaPosition);
        }
        gPop();
        gPop();
    gPop();
}

function drawMewEyes(side) {
    gPush();
    {
    // Create CSMewEyes
    setColor(mewEyesColor);
    if (side == "right") {
        gTranslate(CSMewEyes[0],CSMewEyes[1],CSMewEyes[2]);
        gRotate(45,1,0,0);
    } else {
        gTranslate(CSMewEyes[0],CSMewEyes[1],-CSMewEyes[2]);
        gRotate(-45,1,0,0);
    }
    }
    gPop();
}

function drawMewArms(side, timestamp) {
    gPush();
    {
    // Create CSMewArms
    if (side == "right") {
        //drawAxis();
        gTranslate(CSMewArms[0],CSMewArms[1],CSMewArms[2]);
        //drawAxis();
        gRotate(45,0,0,1);
        if (scene == 3) {
            armsScene3(side, timestamp);
        }
    } else {
        gTranslate(CSMewArms[0],CSMewArms[1],-CSMewArms[2]);
        gRotate(215,0,0,1);
        if (scene == 3) {
            armsScene3(side, timestamp);
        }
    }
    drawLimb("sphere", mewArmsScaling, mewArmsPosition);
    }
    gPop();
}

function armsScene3(side, timestamp) {
    if (side == "right") {
        gTranslate(0,0.3,0);
        mewArmsRotation[0] = -1*Math.abs(50*Math.cos(.00275*timestamp));
        mewArmsRotation[2] = Math.abs(50*Math.cos(.00275*timestamp));
        gRotate(mewArmsRotation[0],1,0,0);
        gRotate(mewArmsRotation[2],0,0,1);
        gTranslate(0,-0.3,0);
    } else {
        gTranslate(0,-0.3,0);
        mewArmsRotation[0] = -1*Math.abs(50*Math.cos(.00275*timestamp));
        mewArmsRotation[2] = Math.abs(50*Math.cos(.00275*timestamp));
        gRotate(mewArmsRotation[0],1,0,0);
        gRotate(mewArmsRotation[2],0,0,1);
        gTranslate(0,0.3,0);
    }
}

function drawMewLegs(side, timestamp) {
    gPush();
	{
    // Create CSMewThigh
    if (side == "right") {
        gTranslate(CSMewThigh[0],CSMewThigh[1],CSMewThigh[2]);
    } else {
        gTranslate(CSMewThigh[0],CSMewThigh[1],-CSMewThigh[2]);
    }
    gRotate(50,0,0,1);
    legsAnimate(timestamp);
    drawLimb("sphere", mewThighScaling, mewThighPosition);
    
    // Create CSMewFoot
    if (side == "right") {
        gRotate(-10,1,0,0);
        gRotate(40,0,0,1);
        gTranslate(CSMewFoot[0],CSMewFoot[1],CSMewFoot[2]);
    } else {
        gRotate(10,1,0,0);
        gRotate(40,0,0,1);
        gTranslate(CSMewFoot[0],CSMewFoot[1],-CSMewFoot[2]);
    }
    drawLimb("sphere", mewFootScaling, mewFootPosition);
    if (side == "right") {
        gTranslate(CSMewSole[0],CSMewSole[1],CSMewSole[2]);
    } else {
        gTranslate(CSMewSole[0],CSMewSole[1],-CSMewSole[2]);
    }
    setColor(mewSoleColor);
    drawLimb("sphere", mewSoleScaling, mewSolePosition);
    }
    gPop();

}

function legsAnimate(timestamp) {
    gTranslate(0,0.7,0);
    if (scene == 3) {
        mewThighRotation[2] = -1*Math.abs(90*Math.cos(0.00275*timestamp));
        gRotate(mewThighRotation[2],0,0,1)
    } else {
        mewThighRotation[2] = -50*Math.cos(0.00275*timestamp);
        gRotate(mewThighRotation[2],0,0,1);
    }
    gTranslate(0,-0.7,0);
}
// --- mew end ---

// Function that draws button
function drawButton(timestamp) {
    gPush();
    {
        // Create CSButtonBase
        setColor(buttonBaseColor);
        gTranslate(CSButtonBase[0],CSButtonBase[1],CSButtonBase[2]);
        drawLimb("cube", buttonBaseScaling, buttonBasePosition);
        // Create CSButton
        gTranslate(CSButton[0],CSButton[1],CSButton[2]);
        setColor(buttonColor)
        if (scene >= 6) {
            if (buttonPressed == 0) {
                buttonPress[1] = -0.6*Math.abs(Math.cos(0.000275*timestamp));
            }
            if (buttonPress[1] < -0.5) {
                buttonPressed = 1;
                const buttonPressedLocation = gl.getUniformLocation(program, 'buttonPressed');
                gl.uniform1i(buttonPressedLocation, buttonPressed);
            }
            gTranslate(buttonPress[0], buttonPress[1], buttonPress[2]);
        }
        drawLimb("sphere", buttonScaling, buttonPosition);
    }
    gPop();
}

// Function that shows FPS every 2 seconds
function showFPS(timestamp) {
    const elapsedTime = timestamp - lastUpdateTime;
    frames++;

    if (elapsedTime >= 2000) {
        const fps = (frames / elapsedTime) * 1000;

        const fpsElement = document.getElementById('fps-counter');
        fpsElement.textContent = 'FPS: ' + fps.toFixed(2); // 2 decimal places

        frames = 0;
        lastUpdateTime = timestamp;
    }
}

// Render function
function render(timestamp) {
    showFPS(timestamp);

    // pass timestamp to fragment shader
    const timestampLocation = gl.getUniformLocation(program, 'timestamp');
    gl.uniform1f(timestampLocation,timestamp);

    // Set background color based on scene
    if (scene >= 6) {
        gl.clearColor(1,1,1,1.0);
    } else {
        gl.clearColor(1.0, 0.9804, 0.9529, 1.0 );
    }
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
    MS = []; // Initialize modeling matrix stack
	
	// initialize the modeling matrix to identity
    modelMatrix = mat4();

    // set scenes
    if (11000 <= timestamp && timestamp < 13500) {
        scene = 2;
    } else if (13500 <= timestamp && timestamp < 16600) {
        scene = 3;
    } else if (16600 <= timestamp && timestamp < 18600) {
        scene = 4;
    } else if (18600 <= timestamp && timestamp < 20600) {
        scene = 5;
    } else if (20600 <= timestamp && timestamp < 22000) {
        scene = 6;
    } else if (22000 <= timestamp) {
        scene = 7;
    }

    // set the camera matrix
    if (scene == 1 || scene == 7) {
        eye = flyAround360(20, timestamp * 0.001, 9)
    } else {
        eye = vec3(0.0, 9.0, -20.0);
    }
    viewMatrix = lookAt(eye, at, up);
   
    // Decide type of projection.
    // Default: Perspective Projection, fovy = 60
    const fovySlider = document.getElementById("fovyRange");
    const fovyValueSpan = document.getElementById("fovyValue");

    fovySlider.addEventListener("input", function () {
        fovy = parseFloat(fovySlider.value);
        fovyValueSpan.textContent = fovy;
    });
    if (usePerspectiveProjection) {
        projectionMatrix = perspective(fovy, aspect, near, far);
    } else {
        projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    }
        
    // set all the matrices
    setAllMatrices();
    
	if( animFlag )
    {
		dt = (timestamp - prevTime) / 1000.0;
		prevTime = timestamp;
	}
    
    drawStadium(timestamp);
    
    drawMew(timestamp);

    drawButton(timestamp);
    
    if( animFlag )
        window.requestAnimFrame(render);
}

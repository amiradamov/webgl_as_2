// app.js
let gl, program;
let vertexCount = 36;
let modelViewMatrix;

let eye = [0, 0, 0.1];
let at = [0, 0, 0];
let up = [0, 1, 0];

// Function to handle keyboard events
window.onkeydown = function(event) {
    switch(event.key) {
      case 'P':
        eye = [0, 0, 2]; // Perspective view
        break;
    }
  };

  function zoomIn() {
    let zoomFactor = 0.1;
    eye[2] -= zoomFactor; // Decrease the z-coordinate of eye for zooming in
  }
  
  function zoomOut() {
    let zoomFactor = 0.1;
    eye[2] += zoomFactor; // Increase the z-coordinate of eye for zooming out
  }

onload = () => {
  let canvas = document.getElementById("webgl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert('No webgl for you');
    return;
  }

  program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.DEPTH_TEST);

  gl.clearColor(0, 0, 0, 0.5);

  let vertices = [
    -1, -1, 1,
    -1, 1, 1,
    1, 1, 1,
    1, -1, 1,
    -1, -1, -1,
    -1, 1, -1,
    1, 1, -1,
    1, -1, -1,
  ];

  let indices = [
    0, 3, 1,
    1, 3, 2,
    4, 7, 5,
    5, 7, 6,
    3, 7, 2,
    2, 7, 6,
    4, 0, 5,
    5, 0, 1,
    1, 2, 5,
    5, 2, 6,
    0, 3, 4,
    4, 3, 7,
  ];

  let colors = [
    0, 0, 0,
    0, 0, 1,
    0, 1, 0,
    0, 1, 1,
    1, 0, 0,
    1, 0, 1,
    1, 1, 0,
    1, 1, 1,
  ];

  let vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  let vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition,3,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(vPosition);

  let iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

  let cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  let vColor = gl.getAttribLocation(program, 'vColor');
  gl.vertexAttribPointer(vColor,3,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(vColor);

  modelViewMatrix = gl.getUniformLocation(program, 'modelViewMatrix');

  render();
};

function render() { 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    let fovy = 60; // Field of view in y-direction
    let aspect = gl.canvas.width / gl.canvas.height;
    let near = 0.1;
    let far = 10;
  
    let projectionMatrix = perspective(fovy, aspect, near, far);
  
    let mvm = lookAt(eye, at, up);
    let mvp = mult(projectionMatrix, mvm);
  
    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(mvp));
  
    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);
  
    requestAnimationFrame(render);
  }
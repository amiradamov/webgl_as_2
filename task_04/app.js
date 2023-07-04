// app.js

let gl, program;
let vertexCount = 36;
let modelViewMatrix;
let isOrthographic = false; // Flag to track the projection mode

let eye = [0, 0, 2];
let at = [0, 0, 0];
let up = [0, 1, 0];

// Function to handle keyboard events
window.onkeydown = function(event) {
  switch(event.key) {
    // ...
    case 'O':
      isOrthographic = true; // Switch to orthographic view
      break;
    case 'P':
      isOrthographic = false; // Switch to perspective view
      break;
  }
};

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

  let vertices2 = [
    3, -1, -1,
    3, 1, -1,
    5, 1, -1,
    5, -1, -1,
    3, -1, -3,
    3, 1, -3,
    5, 1, -3,
    5, -1, -3,
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
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  let iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

  let cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  let vColor = gl.getAttribLocation(program, 'vColor');
  gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  modelViewMatrix = gl.getUniformLocation(program, 'modelViewMatrix');

  render(vertices, vertices2);
};

function render(vertices, vertices2) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let fovy = 60;
  let aspect = gl.canvas.width / gl.canvas.height;
  let near = 0.1;
  let far = 10;

  let projectionMatrix;
  if (isOrthographic) {
    let left = -2;
    let right = 2;
    let bottom = -2;
    let ytop = 2;
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
  } else {
    projectionMatrix = perspective(fovy, aspect, near, far);
  }

  let mvm1 = lookAt(eye, at, up);
  let mvp1 = mult(projectionMatrix, mvm1);

  gl.uniformMatrix4fv(modelViewMatrix, false, flatten(mvp1));
  gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);

  let mvm2 = mult(translate(2, 0, 0), mvm1); // Translate the second cube
  let mvp2 = mult(projectionMatrix, mvm2);

  gl.uniformMatrix4fv(modelViewMatrix, false, flatten(mvp2));
  gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);

  requestAnimationFrame(() => render(vertices, vertices2));
}

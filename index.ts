interface Point {
  x: number;
  y: number;
};


interface Body extends Point {
  mass: number;
  radius: number;
  vX?: number;
  vY?: number;
};

var bodies:Body[] = [];
var width = 1000;
var height= 1000;
var scheduledTick;
var ship = {
  radius: 0,
  mass: 1,
  x: width/2,
  y: height - 100,
  vX: 0,
  vY: 0,
};

var canvas = document.createElement('canvas');
canvas.setAttribute('height', `${height}px`);
canvas.setAttribute('width', `${width}px`);

document.body.appendChild(canvas);

var ctx = canvas.getContext('2d');

function getDistance(p1:Body, p2:Body) {
  return Math.sqrt(Math.pow(
    (p2.x - p2.radius - p1.x - p1.radius), 2) + Math.pow(
    (p2.y - p2.radius - p1.y - p1.radius), 2));
}

function calculateVectorForce(body1:Body, body2:Body):{fX:number, fY:number} {
  let gravityConstant = 1;
  let distance = getDistance(body1, body2);


  // http://exodus.physics.ucla.edu/vizexhibit/2DGravPotVector.html
  return {
    fX: ((-gravityConstant * body2.mass) * (body1.x - body1.radius - body2.x - body2.radius)) / Math.pow(distance,3),
    fY: ((-gravityConstant * body2.mass) * (body1.y - body1.radius - body2.y - body2.radius)) / Math.pow(distance,3)
  }

  // -G * ((m1 * m2) / ABS(R12)^2) * unit vector btw r12
  // https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation#Vector_form
  /*
  let force = (-1 * gravityConstant) * (
    (body1.mass * body2.mass)/(Math.pow(Math.abs(distance), 2))) * (distance / Math.abs(distance));

  */
}

function drawBody(x:number, y:number, r:number) {
  ctx.beginPath();
  ctx.arc(
    x - r/2,
    y - r/2,
    r, 0, 2 * Math.PI);

  ctx.fill();
  ctx.closePath();
}

function drawBodies() {
  bodies.forEach((b) => {
    drawBody(b.x, b.y, b.radius);
  });
}

function gatherForcesActingOn(body:Body):{fX:number, fY:number} {
  return bodies.reduce((prev, b) => {
    let bodyForce = calculateVectorForce(body, b);
    prev.fX += bodyForce.fX;
    prev.fY += bodyForce.fY;

    return prev;
  }, {fX: 0, fY: 0});
}

bodies.push({
  x: width / 2,
  y: 200,
  mass: 10000,
  radius: 20,
});

bodies.push({
  x: 100,
  y: 400,
  mass: 10000,
  radius: 20,
});


function drawShip() {
  ctx.fillStyle = 'orange';
  ctx.fillRect(ship.x - 5, ship.y - 5, 10, 10);
}


function updateShipVelocity() {
  ship.x += ship.vX;
  ship.y += ship.vY;

  let shipForces = gatherForcesActingOn(ship);

  ship.vX += shipForces.fX;
  ship.vY += shipForces.fY;
}

function tick() {
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = 'black';

  drawBodies();
  drawShip();
  updateShipVelocity();
  window.requestAnimationFrame(tick);
}

tick();

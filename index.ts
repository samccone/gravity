interface Point {
  x: number;
  y: number;
};


interface Body extends Point {
  mass: number;
  radius: number;
};
var bodies:Body[] = [];
var width = 500;
var height= 500;
var scheduledTick;

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
  let gravityConstant = 1000;
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

function drawLine(startX:number) {
  for(var i = 0; i < height; i+=5) {
    let pointBody = {
      x: startX,
      y: i,
      mass: 1,
      radius: 0,
    };

    let force = bodies.reduce((prev, b) => {
      let bodyForce = calculateVectorForce(pointBody, b);
      prev.fX += bodyForce.fX;
      prev.fY += bodyForce.fY;

      return prev;
    }, {fX: 0, fY: 0});


    ctx.fillRect(
      startX + force.fX,
      i + force.fY,
      1,
      1);
  }
}

bodies.push({
  x: 200,
  y: 400,
  mass: 10000,
  radius: 0,
});


function tick() {
  ctx.fillStyle = 'rgba(255,100,200,0.2)';
  //ctx.clearRect(0, 0, width, height);
  for(var i = 0; i < width; i+=5) {
    drawLine(i);
  }

  //drawBodies();
  scheduledTick = undefined;
}


document.addEventListener('click', () => ctx.clearRect(0, 0, width, height));
document.addEventListener('tap', () => ctx.clearRect(0, 0, width, height));



canvas.addEventListener('touchmove', function(e:TouchEvent) {
  bodies[0].x = e.touches[0].clientX;
  bodies[0].y = e.touches[0].clientY;


  if (!scheduledTick) {
    scheduledTick = requestAnimationFrame(tick);
  }
});

canvas.addEventListener('mousemove', function(e:MouseEvent) {
  bodies[0].x = e.x;
  bodies[0].y = e.y;


  if (!scheduledTick) {
    scheduledTick = requestAnimationFrame(tick);
  }
});

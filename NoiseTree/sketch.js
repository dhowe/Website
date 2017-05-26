var k = 0, rs = 0, mult = .65, angle=24;

function setup() {
  createCanvas(900,700);
}

function draw() {
  randomSeed(rs);
  background(0,200,255);
  translate(width/2, height);
  branch(130);
  k += 0.01;
}

function branch(len) {

  if (len > 4) {
    
    stroke(0,200);
    var sw = map(len, 200, 4, 20, .1);
    //strokeWeight(sw);
    //line(0, 0, 0, -len);
    oline(0, 0, 0, -len, sw);
    translate(0, -len);
    
    len *= random(.5,.9);

    push();
    rotate(radians(-angle + map(noise(k),0,1,-10,10)));
    branch(len);
    pop();

    push();
    rotate(radians(angle + map(noise(1000+k),0,1,-10,10)));
    branch(len);
    pop();
    
    if (random(1) < .5) {
      push();
      rotate(radians(angle/2 + map(noise(1000+k),0,1,-10,10)));
      branch(len);
      pop();
    }
  }
  else {
    noStroke();
    fill(random(100,255),0,0,32);
    ellipse(0,0,random(2,5),random(10,20));
    //text(random(1)>.5 ? '1':'0',0,0);//,random(2,5),random(10,20));
    //text('1',0,0);
  }
}

function mouseClicked() {
  rs = random(1000);
}

function oline(x1, y1, x2, y2, weight)
{
  strokeCap(ROUND);
  strokeWeight(weight);

  var twisti = 1 + (weight/24.0);

  var xd = x2 - x1, yd = y2 - y1;
  var dist = sqrt(xd * xd + yd * yd);
  var sections = ceil(dist / 10.0);
  //sections = 8;

  var twist, twist2 = new Array(sections + 1);
  for (var i = 0; i < twist2.length; i++) {
     twist2[i] = 0.0;
  }

  for (var i = 0; i < sections; i++)
  {
    twist = random(-twisti, twisti);
    var tx1 = x1 + ((xd / sections) * (i)) + twist2[i];
    var tx2 = x1 + ((xd / sections) * (i + 1)) + twist;
    var ty1 = y1 + ((yd / sections) * (i));
    var ty2 = y1 + ((yd / sections) * (i + 1));
    if (i == sections - 1)
    {
      tx2 = x2;
      ty2 = y2;
    }
    line(tx1, ty1, tx2, ty2);
    twist2[i + 1] = twist;
  }
}
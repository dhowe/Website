float k, rs, mult = .65, angle=24;

void setup() {
  size(900,700);
}

void draw() {
  randomSeed((int)rs);
  background(0,200,255);
  translate(width/2, height);
  branch(140);
  k += 0.01;
}

void branch(float len) {

  if (len > 4) {
    
    stroke(0,200);
    float sw = map(len, 200, 4, 20, .1);
    //strokeWeight(sw);
    //line(0, 0, 0, -len);
    oline(0, 0, 0, -len, sw);
    translate(0, -len);
    
    len *= random(.5,.9);

    pushMatrix();
    rotate(radians(-angle + map(noise(k),0,1,-10,10)));
    branch(len);
    popMatrix();

    pushMatrix();
    rotate(radians(angle + map(noise(1000+k),0,1,-10,10)));
    branch(len);
    popMatrix();
    
    if (random(1) < .5) {
      pushMatrix();
      rotate(radians(angle/2 + map(noise(1000+k),0,1,-10,10)));
      branch(len);
      popMatrix();
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

void mouseClicked() {
  rs = random(1000);
}

void oline(float x1, float y1, float x2, float y2, float weight)
{
  strokeCap(ROUND);
  strokeWeight(weight);

  float twisti = 1 + (weight/24.0f);

  float xd = x2 - x1, yd = y2 - y1;
  float dist = sqrt(xd * xd + yd * yd);
  int sections = ceil(dist / 10.0f);
  // sections = 8;

  float twist, twist2[] = new float[sections + 1];
  for (int i = 0; i < sections; i++)
  {
    twist = random(-twisti, twisti);
    float tx1 = x1 + ((xd / sections) * (i)) + twist2[i];
    float tx2 = x1 + ((xd / sections) * (i + 1)) + twist;
    float ty1 = y1 + ((yd / sections) * (i));
    float ty2 = y1 + ((yd / sections) * (i + 1));
    if (i == sections - 1)
    {
      tx2 = x2;
      ty2 = y2;
    }
    line(tx1, ty1, tx2, ty2);
    twist2[i + 1] = twist;
  }
}

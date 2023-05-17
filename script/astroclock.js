// Generated by CoffeeScript 1.6.3
(function() {
  "use strict";
  var DecimalDay, Jupiter, LHA, LST, Mars, Mercury, Moon, Saturn, Sun, SunLongitude, SunPos, UTC, Venus, altaz, altazToPlot, anySunrise, astroclock, baseSinceEpoch, begin, canvas, canvasApp, cartesianFromPolar2, computeDaytime, computePlanets, copyTime, dayFrac, days, diffInSeconds, disk, drawClock, drawPlanets, drawText, eccAnomaly, ecl, ellipseToPolar, geoEr, geoOption, geocentric, getAnyMoon, getAnyMoonPhase, getAnyPP, getDefaultDisplay, getGMST0, getSunHorizonLHA, hasCanvas, here, lat_slider, localNoon, localsolarnoon, long_slider, millisPerDay, mousehandler, oneAltaz, pad, planetValues, planets, plotAnySun, polarFromCartesian2, polarFromCartesian3, position, primaryCentric, radec, radiusFromCartesian2, radiusFromCartesian3, rotate2, showError, sq, started, sunhide, tagged, toLocalNoon, toRadians, updateLabels, usePosition;

  canvas = document.getElementById("display");

  lat_slider = document.getElementById("lat");

  long_slider = document.getElementById("long");

  here = void 0;

  started = false;

  toRadians = Math.PI / 180;

  tagged = void 0;

  days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  planetValues = [];

  updateLabels = function() {
    document.getElementById("lat_label").firstChild.nodeValue = "Latitude " + lat_slider.value;
    return document.getElementById("long_label").firstChild.nodeValue = "Longitude " + long_slider.value;
  };

  disk = function(pos, ctx) {
    var result, x, y;
    if (pos.visible) {
      ctx.fillStyle = pos.context.colour;
      x = Math.round(pos.x);
      y = Math.round(pos.y);
      ctx.beginPath();
      ctx.arc(x, y, pos.context.R, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      result = {
        x: x,
        y: y
      };
      return result;
    }
  };

  Sun = function(d) {
    return {
      name: "Sun",
      tag: "Sun \u2609",
      colour: "Yellow",
      N: 0.0,
      i: 0.0,
      w: (282.9404 + 4.70935e-5 * d) * toRadians,
      a: 1.000000,
      e: 0.016709 - 1.151e-9 * d,
      M: (356.0470 + 0.9856002585 * d) * toRadians,
      R: 5,
      draw: function(pos, ctx) {
        return disk(pos, ctx);
      }
    };
  };

  Moon = function(d) {
    return {
      name: "Moon",
      tag: "Moon \u263e",
      colour: "LightGray",
      N: (125.1228 - 0.0529538083 * d) * toRadians,
      i: 5.1454 * toRadians,
      w: (318.0634 + 0.1643573223 * d) * toRadians,
      a: 60.2666,
      e: 0.054900,
      M: (115.3654 + 13.0649929509 * d) * toRadians,
      R: 5,
      draw: function(pos, ctx) {
        var factor, x, y;
        if (!pos.visible) {
          return;
        }
        ctx.fillStyle = pos.context.colour;
        x = Math.round(pos.x);
        y = Math.round(pos.y);
        ctx.strokeStyle = this.colour;
        ctx.lineWidth = 1;
        if (Math.abs(pos.phase) < 0.25) {
          return disk(pos, ctx);
        } else {
          factor = pos.phase < 0 ? -1 : 1;
          ctx.beginPath();
          ctx.arc(x, y, pos.context.R, factor * Math.PI / 2, -Math.PI / 2 * factor, true);
          if (Math.abs(pos.phase) < 0.75) {
            ctx.closePath();
            return ctx.fill();
          } else {
            ctx.stroke();
            return ctx.closePath();
          }
        }
      }
    };
  };

  Mercury = function(d) {
    return {
      name: "Mercury",
      tag: "Mercury \u263f",
      colour: "Gray",
      N: (48.3313 + 3.24587e-5 * d) * toRadians,
      i: (7.0047 + 5.00e-8 * d) * toRadians,
      w: (29.1241 + 1.01444e-5 * d) * toRadians,
      a: 0.387098,
      e: 0.205635 + 5.59e-10 * d,
      M: (168.6562 + 4.0923344368 * d) * toRadians,
      R: 1,
      draw: function(pos, ctx) {
        return disk(pos, ctx);
      }
    };
  };

  Venus = function(d) {
    return {
      name: "Venus",
      tag: "Venus \u2640",
      colour: "White",
      N: (76.6799 + 2.46590e-5 * d) * toRadians,
      i: (3.3946 + 2.75e-8 * d) * toRadians,
      w: (54.8910 + 1.38374e-5 * d) * toRadians,
      a: 0.723330,
      e: 0.006773 - 1.302e-9 * d,
      M: (48.0052 + 1.6021302244 * d) * toRadians,
      R: 3,
      draw: function(pos, ctx) {
        return disk(pos, ctx);
      }
    };
  };

  Mars = function(d) {
    return {
      name: "Mars",
      tag: "Mars \u2642",
      colour: "Red",
      N: (49.5574 + 2.11081e-5 * d) * toRadians,
      i: (1.8497 - 1.78e-8 * d) * toRadians,
      w: (286.5016 + 2.92961e-5 * d) * toRadians,
      a: 1.523688,
      e: 0.093405 + 2.516e-9 * d,
      M: (18.6021 + 0.5240207766 * d) * toRadians,
      R: 1,
      draw: function(pos, ctx) {
        return disk(pos, ctx);
      }
    };
  };

  Jupiter = function(d) {
    return {
      name: "Jupiter",
      tag: "Jupiter \u2643",
      colour: "LightGray",
      N: (100.4542 + 2.76854e-5 * d) * toRadians,
      i: (1.3030 - 1.557e-7 * d) * toRadians,
      w: (273.8777 + 1.64505e-5 * d) * toRadians,
      a: 5.20256,
      e: 0.048498 + 4.469e-9 * d,
      M: (19.8950 + 0.0830853001 * d) * toRadians,
      R: 3,
      draw: function(pos, ctx) {
        return disk(pos, ctx);
      }
    };
  };

  Saturn = function(d) {
    return {
      name: "Saturn",
      tag: "Saturn \u2644",
      colour: "Yellow",
      N: (113.6634 + 2.38980e-5 * d) * toRadians,
      i: (2.4886 - 1.081e-7 * d) * toRadians,
      w: (339.3939 + 2.97661e-5 * d) * toRadians,
      a: 9.55475,
      e: 0.055546 - 9.499e-9 * d,
      M: (316.9670 + 0.0334442282 * d) * toRadians,
      R: 3,
      draw: function(pos, ctx) {
        var p;
        p = disk(pos, ctx);
        if (p) {
          ctx.strokeStyle = this.colour;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x - (this.R * 2), p.y);
          ctx.lineTo(p.x + (this.R * 2), p.y);
          ctx.stroke();
          return ctx.closePath();
        }
      }
    };
  };

  planets = function(d) {
    return [Mercury(d), Venus(d), Mars(d), Jupiter(d), Saturn(d)];
  };

  hasCanvas = function() {
    var context, e;
    context = null;
    try {
      context = canvas.getContext("2d");
    } catch (_error) {
      e = _error;
      return;
    }
    return context;
  };

  pad = function(x) {
    if (x < 10) {
      return '0' + x;
    } else {
      return x;
    }
  };

  sq = function(t) {
    return t * t;
  };

  radiusFromCartesian2 = function(x, y) {
    var r2;
    r2 = sq(x) + sq(y);
    return Math.sqrt(r2);
  };

  radiusFromCartesian3 = function(x, y, z) {
    var r2;
    r2 = sq(x) + sq(y) + sq(z);
    return Math.sqrt(r2);
  };

  polarFromCartesian2 = function(x, y) {
    return {
      theta: Math.atan2(y, x),
      r: radiusFromCartesian2(x, y)
    };
  };

  polarFromCartesian3 = function(x, y, z) {
    return {
      RA: Math.atan2(y, x),
      Dec: Math.atan2(z, radiusFromCartesian2(x, y)),
      rg: radiusFromCartesian3(x, y, z)
    };
  };

  cartesianFromPolar2 = function(r, theta) {
    return {
      x: r * Math.cos(theta),
      y: r * Math.sin(theta)
    };
  };

  ellipseToPolar = function(semiMajor, eccentricity, anomaly) {
    var xv, yv;
    xv = semiMajor * (Math.cos(anomaly) - eccentricity);
    yv = semiMajor * (Math.sqrt(1.0 - sq(eccentricity)) * Math.sin(anomaly));
    return polarFromCartesian2(xv, yv);
  };

  rotate2 = function(xo, yo, theta) {
    return {
      x: xo * Math.cos(theta) - yo * Math.sin(theta),
      y: xo * Math.sin(theta) + yo * Math.cos(theta)
    };
  };

  sunhide = Math.sin((-0.833) * toRadians);

  millisPerDay = 1000 * 86400;

  baseSinceEpoch = 10956;

  copyTime = function(now) {
    var t;
    t = new Date();
    t.setTime(now.getTime());
    return t;
  };

  UTC = function(d) {
    return d.getTime() - 60000 * d.getTimezoneOffset();
  };

  DecimalDay = function(d) {
    return (UTC(d) / millisPerDay) - baseSinceEpoch;
  };

  dayFrac = function(d) {
    var frac;
    frac = UTC(d) % millisPerDay;
    return frac / millisPerDay;
  };

  toLocalNoon = function(noon) {
    noon.setHours(12);
    noon.setMinutes(0);
    noon.setSeconds(0);
    noon.setMilliseconds(0);
    return noon;
  };

  localNoon = function() {
    var noon;
    noon = new Date();
    return toLocalNoon(noon);
  };

  diffInSeconds = function(dt1, dt2) {
    return (dt1.getTime() - dt2.getTime()) / 1000.0;
  };

  ecl = function(d) {
    return (23.4393 - 3.563e-7 * d) * toRadians;
  };

  getGMST0 = function(sun) {
    var x;
    x = 180 + ((sun.M + sun.w) / toRadians);
    while (x > 360) {
      x -= 360.0;
    }
    return x;
  };

  SunLongitude = function(dsun) {
    var E, lonsun, result, vr;
    E = dsun.M + dsun.e * Math.sin(dsun.M) * (1.0 + dsun.e * Math.cos(dsun.M));
    vr = ellipseToPolar(1.0, dsun.e, E);
    lonsun = vr.theta + dsun.w;
    return result = {
      v: vr.theta,
      r: vr.r,
      lonsun: lonsun
    };
  };

  SunPos = function(d) {
    var dsun, result, vrx, xys, yze;
    dsun = Sun(d);
    vrx = SunLongitude(dsun);
    xys = cartesianFromPolar2(vrx.r, vrx.lonsun);
    yze = cartesianFromPolar2(xys.y, ecl(d));
    result = polarFromCartesian3(xys.x, yze.x, yze.y);
    result.context = dsun;
    return result;
  };

  LST = function(d, longitude) {
    var quant;
    quant = Sun(DecimalDay(d));
    return getGMST0(quant) + longitude + 360.0 * dayFrac(d);
  };

  LHA = function(d, longitude, ra) {
    return LST(d, longitude) * toRadians - ra;
  };

  altaz = function(dec, lat, lha) {
    var aa, xt, yt;
    xt = Math.asin(Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(lha));
    yt = Math.acos((Math.sin(dec) - Math.sin(lat) * Math.sin(xt)) / (Math.cos(lat) * Math.cos(xt)));
    if (Math.sin(lha) > 0.0) {
      yt = 2.0 * Math.PI - yt;
    }
    return aa = {
      alt: xt,
      az: yt
    };
  };

  getSunHorizonLHA = function(prev, lat) {
    var cosLHA, result, safe, val;
    val = SunPos(DecimalDay(prev));
    cosLHA = (sunhide - Math.sin(lat) * Math.sin(val.Dec)) / (Math.cos(lat) * Math.cos(val.Dec));
    safe = Math.abs(cosLHA) < 1.0;
    return result = {
      safe: safe,
      sign: safe ? "" : (cosLHA > 0 ? "+" : "-"),
      angle: safe ? cosLHA : 0.0
    };
  };

  altazToPlot = function(alt, az, display) {
    var r, result;
    r = display.radius * (1.0 - 2.0 * (alt / Math.PI));
    return result = {
      x: display.centreX - r * Math.sin(az),
      y: display.centreY - r * Math.cos(az),
      visible: alt > sunhide
    };
  };

  localsolarnoon = function(prev, longitude) {
    var UT_Sun_in_south, millis, time, utcDays, val;
    val = SunPos(DecimalDay(prev));
    UT_Sun_in_south = ((val.RA / toRadians) - getGMST0(val.context) - longitude) / 360.0;
    if (UT_Sun_in_south) {
      UT_Sun_in_south += 1;
    }
    utcDays = Math.floor(UTC(prev) / millisPerDay);
    time = new Date();
    millis = millisPerDay * utcDays;
    millis = millis + (millisPerDay * UT_Sun_in_south);
    time.setTime(millis);
    return time;
  };

  anySunrise = function(prev, isSunup, display) {
    var getNext, good, jolt, lat, line, next, noon, sign, x;
    lat = display.latitude * toRadians;
    sign = isSunup ? -180.0 : 180.0;
    getNext = function(sign, cosLHA, noon) {
      var lha, tmp;
      lha = (3600 * 1000) * sign * Math.acos(cosLHA) / (Math.PI * 15.04107);
      tmp = new Date();
      tmp.setTime(noon.getTime() + lha);
      return tmp;
    };
    jolt = 100;
    good = true;
    line = "";
    while (good && jolt > 30) {
      x = getSunHorizonLHA(prev, lat);
      good = x.safe;
      if (!good) {
        line = x.sign;
      } else {
        noon = localsolarnoon(prev, display.longitude);
        next = getNext(sign, x.angle, noon);
        jolt = diffInSeconds(prev, next);
        if (jolt > 30) {
          prev = next;
        } else {
          line = pad(next.getHours()) + ":" + pad(next.getMinutes());
        }
      }
    }
    return line;
  };

  oneAltaz = function(radec, d, display) {
    var alt_az, lha, result;
    lha = LHA(d, display.longitude, radec.RA);
    alt_az = altaz(radec.Dec, display.latitude * toRadians, lha);
    result = altazToPlot(alt_az.alt, alt_az.az, display);
    result.context = radec.context;
    return result;
  };

  eccAnomaly = function(planet) {
    var e0, e1, next;
    e0 = planet.M + planet.e * Math.sin(planet.M) * (1.0 + planet.e * Math.cos(planet.M));
    next = function(e) {
      return e - (e - planet.e * Math.sin(e) - planet.M) / (1.0 - planet.e * Math.cos(e));
    };
    e1 = next(e0);
    while (Math.abs(e0 - e1) > 1.0e-8) {
      e0 = e1;
      e1 = next(e0);
    }
    return e1;
  };

  position = function(planet) {
    return ellipseToPolar(planet.a, planet.e, eccAnomaly(planet));
  };

  primaryCentric = function(planet) {
    var i, n, result, vr, vw;
    vr = position(planet);
    vw = vr.theta + planet.w;
    n = planet.N;
    i = planet.i;
    return result = {
      x: vr.r * (Math.cos(n) * Math.cos(vw) - Math.sin(n) * Math.sin(vw) * Math.cos(i)),
      y: vr.r * (Math.sin(n) * Math.cos(vw) + Math.cos(n) * Math.sin(vw) * Math.cos(i)),
      z: vr.r * (Math.sin(vw) * Math.sin(i))
    };
  };

  geocentric = function(planet, sun) {
    var result;
    return result = {
      x: planet.x + sun.x,
      y: planet.y + sun.y,
      z: planet.z
    };
  };

  radec = function(planet, sun, d) {
    var geo, rd, rot;
    geo = geocentric(primaryCentric(planet), primaryCentric(sun));
    rot = rotate2(geo.y, geo.z, ecl(d));
    rd = polarFromCartesian3(geo.x, rot.x, rot.y);
    rd.context = planet;
    return rd;
  };

  geoEr = function(planet, date, display) {
    var alt_az, alt_topoc, d, dimensionless, geo, lha, r, result, rot;
    d = DecimalDay(date);
    geo = primaryCentric(planet);
    rot = rotate2(geo.y, geo.z, ecl(d));
    r = polarFromCartesian3(geo.x, rot.x, rot.y);
    lha = LHA(date, display.longitude, r.RA);
    alt_az = altaz(r.Dec, display.latitude * toRadians, lha);
    dimensionless = 1.0 / r.rg;
    alt_topoc = alt_az.alt - Math.asin(dimensionless) * Math.cos(alt_az.alt);
    result = altazToPlot(alt_topoc, alt_az.az, display);
    result.context = planet;
    return result;
  };

  plotAnySun = function(now, display) {
    var pos, t;
    t = copyTime(now);
    pos = SunPos(DecimalDay(now));
    return oneAltaz(pos, t, display);
  };

  getAnyMoon = function(now, display) {
    var t;
    t = copyTime(now);
    return geoEr(Moon(DecimalDay(now)), t, display);
  };

  getAnyPP = function(now, display) {
    var d, p, sun, _i, _len, _ref, _results;
    d = DecimalDay(now);
    sun = Sun(d);
    _ref = planets(d);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      _results.push(oneAltaz(radec(p, sun, d), copyTime(now), display));
    }
    return _results;
  };

  getDefaultDisplay = function() {
    var display;
    return display = {
      latitude: 52,
      longitude: 0,
      centreX: 120,
      centreY: 120,
      radius: 100
    };
  };

  getAnyMoonPhase = function(now, display) {
    var dec, elong, latecl, lonecl, moon, phase, sun;
    dec = DecimalDay(now);
    sun = SunLongitude(Sun(dec));
    moon = primaryCentric(Moon(dec));
    lonecl = Math.atan2(moon.y, moon.x);
    latecl = Math.atan2(moon.z, radiusFromCartesian2(moon.x, moon.y));
    elong = Math.acos(Math.cos(sun.lonsun - lonecl) * Math.cos(latecl));
    phase = (1.0 - Math.cos(Math.PI - elong)) / 2.0;
    if (Math.sin(sun.lonsun - lonecl) > 0.0) {
      return -phase;
    } else {
      return phase;
    }
  };

  computePlanets = function(now, display) {
    var result;
    result = {
      Sun: plotAnySun(now, display),
      Planets: getAnyPP(now, display),
      Moon: getAnyMoon(now, display)
    };
    result.Moon.phase = getAnyMoonPhase(now, display);
    return result;
  };

  drawPlanets = function(planetList, context) {
    var planet, _i, _len, _ref;
    planetList.Sun.context.draw(planetList.Sun, context);
    _ref = planetList.Planets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      planet = _ref[_i];
      planet.context.draw(planet, context);
    }
    return planetList.Moon.context.draw(planetList.Moon, context);
  };

  computeDaytime = function(now) {
    var sundown, sunup, t;
    t = copyTime(now);
    sunup = anySunrise(t, true, getDefaultDisplay());
    t = copyTime(now);
    sundown = anySunrise(t, false, getDefaultDisplay());
    return sunup + "-" + sundown;
  };

  drawText = function(context, message, w, delta) {
    var metrics;
    metrics = context.measureText(message);
    return context.fillText(message, w + (w - metrics.width) / 2, canvas.height / 2 + delta);
  };

  drawClock = function(context, dim, thick, now) {
    var i, _fn, _i;
    context.strokeStyle = "white";
    context.lineWidth = dim / 30;
    context.beginPath();
    context.moveTo(5, dim);
    context.lineTo(thick, dim);
    context.moveTo(2 * dim - 5, dim);
    context.lineTo(2 * dim - thick, dim);
    context.moveTo(dim, 5);
    context.lineTo(dim, thick);
    context.moveTo(dim, 2 * dim - 5);
    context.lineTo(dim, 2 * dim - thick);
    context.stroke();
    context.closePath();
    context.save();
    context.lineWidth = dim / 50;
    context.translate(dim, dim);
    context.beginPath();
    _fn = function(i) {
      context.rotate(Math.PI / 6);
      context.moveTo(0, dim - thick / 3);
      return context.lineTo(0, dim - thick);
    };
    for (i = _i = 1; _i <= 11; i = ++_i) {
      _fn(i);
    }
    context.stroke();
    context.closePath();
    context.restore();
    context.save();
    context.translate(dim, dim);
    context.lineWidth = dim / 30;
    context.beginPath();
    context.rotate((30 * now.getHours() + now.getMinutes() / 2) * Math.PI / 180);
    context.moveTo(0, 0);
    context.lineTo(0, -dim / 2);
    context.stroke();
    context.closePath();
    context.restore();
    context.save();
    context.translate(dim, dim);
    context.lineWidth = dim / 50;
    context.beginPath();
    context.rotate((6 * now.getMinutes()) * Math.PI / 180);
    context.moveTo(0, 0);
    context.lineTo(0, -3 * dim / 4);
    context.stroke();
    context.closePath();
    context.restore();
    context.save();
    context.translate(dim, dim);
    context.lineWidth = dim / 75;
    context.beginPath();
    context.rotate((6 * now.getSeconds()) * Math.PI / 180);
    context.moveTo(0, 0);
    context.lineTo(0, -4 * dim / 5);
    context.stroke();
    context.closePath();
    return context.restore();
  };

  astroclock = function() {
    var context, date, day, dim, display, h, inner, m, message, metrics, now, planet, radius, riseset, s, thick, time, w, _i, _len, _ref;
    context = hasCanvas();
    if (!context) {
      return;
    }
    w = canvas.width / 2;
    if (w > canvas.height) {
      w = canvas.height;
    }
    dim = w / 2;
    inner = dim / 1.2;
    display = {
      latitude: parseFloat(lat_slider.value),
      longitude: parseFloat(long_slider.value),
      centreX: w / 2,
      centreY: w / 2,
      radius: inner
    };
    now = new Date();
    s = computePlanets(copyTime(now), display);
    context.globalCompositeOperation = "source-over";
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawPlanets(s, context);
    planetValues = [];
    _ref = s.Planets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      planet = _ref[_i];
      planetValues.push(planet);
    }
    planetValues.push(s.Sun);
    planetValues.push(s.Moon);
    thick = dim - inner;
    radius = dim - thick / 2;
    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = thick;
    context.arc(dim, dim, radius, 0, 2 * Math.PI, false);
    context.stroke();
    context.closePath();
    drawClock(context, dim, thick, now);
    context.font = "bold " + (w / 8) + "px 'Segoe UI','Open Sans',Calibri,verdana,helvetica,arial,sans-serif";
    context.fillStyle = 'white';
    h = now.getHours();
    m = pad(now.getMinutes());
    s = pad(now.getSeconds());
    time = h + ':' + m + ':' + s;
    day = days[now.getDay()];
    date = now.toLocaleDateString();
    riseset = computeDaytime(now);
    drawText(context, time, w, -w / 6);
    drawText(context, day, w, 0);
    drawText(context, date, w, w / 6);
    drawText(context, riseset, w, w / 3);
    if (tagged) {
      context.font = "16px 'Segoe UI','Open Sans',Calibri,verdana,helvetica,arial,sans-serif";
      message = tagged.context.tag;
      metrics = context.measureText(message);
      context.strokeStyle = "AntiqueWhite";
      context.lineWidth = 18;
      context.beginPath();
      context.moveTo(tagged.x - 2 + 2 * tagged.context.R, tagged.y - 6);
      context.lineTo(tagged.x + metrics.width + 2 + 2 * tagged.context.R, tagged.y - 6);
      context.stroke();
      context.closePath();
      context.fillStyle = "black";
      return context.fillText(message, tagged.x + 2 * tagged.context.R, tagged.y);
    }
  };

  begin = function() {
    if (started) {
      return;
    }
    started = true;
    if (here) {
      lat_slider.value = here.coords.latitude;
      long_slider.value = here.coords.longitude;
      fdSlider.updateSlider("lat");
      fdSlider.updateSlider("long");
      lat_slider.value = here.coords.latitude;
      long_slider.value = here.coords.longitude;
      updateLabels();
    }
    setInterval(astroclock, 250);
  };

  usePosition = function(position) {
    here = position;
    begin();
  };

  showError = function(e) {
    return begin();
  };

  geoOption = {
    timeout: 10000
  };

  canvasApp = function() {
    var e;
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(usePosition, showError, geoOption);
        setTimeout(begin, geoOption.timeout);
      } else {
        begin();
      }
    } catch (_error) {
      e = _error;
      begin();
    }
  };

  mousehandler = function(e) {
    var context, d, dist, planet, pos, rect, target, _i, _len;
    context = hasCanvas();
    if (!context) {
      return;
    }
    rect = canvas.getBoundingClientRect();
    pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    dist = 800;
    target = false;
    for (_i = 0, _len = planetValues.length; _i < _len; _i++) {
      planet = planetValues[_i];
      d = radiusFromCartesian2(pos.x - planet.x, pos.y - planet.y);
      if (d < dist && d < 8) {
        dist = d;
        target = planet;
      }
    }
    return tagged = target;
  };

  this.astroclock = {
    sq: sq,
    planets: planets,
    radiusFromCartesian2: radiusFromCartesian2,
    radiusFromCartesian3: radiusFromCartesian3,
    DecimalDay: DecimalDay,
    toLocalNoon: toLocalNoon,
    ecl: ecl,
    getGMST0: getGMST0,
    Sun: Sun,
    SunPos: SunPos,
    LHA: LHA,
    dayFrac: dayFrac,
    altaz: altaz,
    getSunHorizonLHA: getSunHorizonLHA,
    altazToPlot: altazToPlot,
    getDefaultDisplay: getDefaultDisplay,
    localsolarnoon: localsolarnoon,
    anySunrise: anySunrise,
    primaryCentric: primaryCentric,
    Mercury: Mercury,
    Mars: Mars,
    geocentric: geocentric,
    Venus: Venus,
    Jupiter: Jupiter,
    radec: radec,
    Saturn: Saturn,
    plotAnySun: plotAnySun
  };

  this.canvasApp = canvasApp;

  this.updateLabels = updateLabels;

  this.mousehandler = mousehandler;

}).call(this);

// cspell:words LUTETIA, SIWA, MATHILDE, GEOGRAPHOS, TOUTATIS, OTAWARA, ITOKAWA, BENNU, HAUMEA, GONGGONG, INTERAMNIA, KALLIOPE, MAKEMAKE

/* eslint-disable react/no-this-in-sfc */
import React from 'react';

import css from './n-body.module.css';

export const NBody: React.FC = () => {
  const div = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const AU = 1.49598e11; //Astronomical Unit (distance between earth in sun)
    const G = 6.6743015e-11; //Constant of Gravity
    const DAY = 24 * 60 * 60;
    const TIME_SCALE = 1000;
    const GRAVITY_SCALE = 100;

    const centerX = div.current!.offsetWidth / 2;
    const centerY = div.current!.offsetHeight / 2;

    class Velocity {
      public x: number;
      public y: number;

      public constructor(x: number, y: number, _z?: number) {
        this.x = x;
        this.y = y;
      }

      public accelerate(a: Velocity): void {
        this.x += a.x;
        this.y += a.y;
      }

      public times(a: number): Velocity {
        return new Velocity(this.x * a, this.y * a);
      }
    }

    class Position {
      public x: number;
      public y: number;

      public constructor(x: number, y: number, _z?: number) {
        this.x = x;
        this.y = y;
      }

      public move(v: Velocity): void {
        this.x += v.x;
        this.y += v.y;
      }

      public centerOn(p: Position): void {
        this.x -= p.x;
        this.y -= p.y;
      }

      public distance(p: Position): number {
        const deltaX = this.x - p.x;
        const deltaY = this.y - p.y;

        return Math.hypot(deltaX, deltaY);
      }
    }

    class Body {
      public position: Position;
      public velocity: Velocity;
      public mass: number;

      public element: HTMLDivElement;
      public thumb: unknown;

      public trails: HTMLDivElement[];
      public trailPointer: number;

      public name: string;

      public constructor(
        name: string,
        color: string,
        position: Position,
        velocity: Velocity,
        mass: number,
      ) {
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;

        this.thumb = null;

        this.element = document.createElement('div');
        this.element.style.position = 'absolute';
        this.element.innerHTML = `● ${name}`;
        this.element.style.color = color;
        this.element.style.visibility = 'hidden';
        div.current!.append(this.element);

        this.trails = Array.from({ length: 100 })
          .fill(null)
          .map(() => {
            const trail = document.createElement('div');
            trail.style.position = 'absolute';
            trail.innerHTML = '·';
            trail.style.color = color;
            trail.style.visibility = 'hidden';
            div.current!.append(trail);
            return trail;
          });
        this.trailPointer = 0;
        this.name = name;
      }

      public distance(p: Position): number {
        return this.position.distance(p);
      }

      public gravity(b: Body): Velocity {
        const deltaX = b.position.x - this.position.x;
        const deltaY = b.position.y - this.position.y;
        const distance = Math.hypot(deltaX, deltaY);
        const accel = (G / (distance * distance)) * b.mass;
        const vX = (deltaX / distance) * accel;
        const vY = (deltaY / distance) * accel;
        return new Velocity(vX, vY);
      }

      public plot(): void {
        const x = Math.round(centerX + (this.position.x * 250) / AU);
        const y = Math.round(centerY - (this.position.y * 250) / AU);

        this.trails[this.trailPointer].style.visibility = 'visible';
        this.trails[this.trailPointer].style.left = `${x}px`;
        this.trails[this.trailPointer].style.top = `${y}px`;

        this.trailPointer = (this.trailPointer + 1) % 100;

        this.element.style.visibility = 'visible';
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
      }

      public destroy(): void {
        for (const trail of this.trails) {
          trail.remove();
        }
        this.element.remove();
      }

      public move(a = 1): void {
        this.position.move(this.velocity.times(a));
      }
    }

    function MoveAll(): void {
      for (let i = 0; i < TIME_SCALE; i++) {
        for (const body1 of bodies) {
          for (const body2 of bodies) {
            if (body1 !== body2) {
              body1.velocity.accelerate(body1.gravity(body2).times(GRAVITY_SCALE));
            }
          }
        }

        for (const body of bodies) {
          body.move(GRAVITY_SCALE);
        }
      }

      // Recenter everything on the sun
      const sun = bodies[0].position;
      for (const body of bodies) {
        body.position.centerOn(sun);
      }

      for (const body of bodies) {
        body.plot();
      }

      timer = setTimeout(MoveAll, 100);
    }

    const bodies = [
      new Body(
        'SUN',
        '#FFFFFF',
        new Position(0.0 * AU, 0.0 * AU, 0.0 * AU),
        new Velocity((0.0 * AU) / DAY, (0.0 * AU) / DAY, (0.0 * AU) / DAY),
        1.9891e30,
      ),
      new Body(
        'MERCURY',
        '#00FF00',
        new Position(
          -3.984991668595178e-1 * AU,
          -2.56192834051416e-2 * AU,
          3.377976514394734e-2 * AU,
        ),
        new Velocity(
          (-4.011712561002649e-3 * AU) / DAY,
          (-2.686224938128134e-2 * AU) / DAY,
          (-1.826155960106947e-3 * AU) / DAY,
        ),
        3.302e23,
      ),
      new Body(
        'VENUS',
        '#FFFF00',
        new Position(
          7.230330310210821e-1 * AU,
          5.504058230745216e-2 * AU,
          -4.098086643873699e-2 * AU,
        ),
        new Velocity(
          (-1.616722836816922e-3 * AU) / DAY,
          (2.007557233161879e-2 * AU) / DAY,
          (3.676760074327269e-4 * AU) / DAY,
        ),
        4.8685e24,
      ),
      new Body(
        'EARTH',
        '#0000FF',
        new Position(
          9.90430263764887e-1 * AU,
          -1.784568222691539e-1 * AU,
          -4.71184785240475e-6 * AU,
        ),
        new Velocity(
          (2.767612493924405e-3 * AU) / DAY,
          (1.687358983367364e-2 * AU) / DAY,
          (-2.06041316215512e-7 * AU) / DAY,
        ),
        5.9736e24,
      ),
      new Body(
        'LUNA',
        '#CCCCCC',
        new Position(
          9.880635743981107e-1 * AU,
          -1.796271733664833e-1 * AU,
          2.247808149105485e-4 * AU,
        ),
        new Velocity(
          (3.000517036102636e-3 * AU) / DAY,
          (1.634972428232062e-2 * AU) / DAY,
          (1.617217556214179e-5 * AU) / DAY,
        ),
        7.349e22,
      ),
      new Body(
        'CERES',
        '#888888',
        new Position(2.732617277025615 * AU, 7.734822664676754e-1 * AU, -9.207592896905449e-1 * AU),
        new Velocity(
          (3.368590810386608e-3 * AU) / DAY,
          (8.330863405401928e-3 * AU) / DAY,
          (3.238410491551668e-3 * AU) / DAY,
        ),
        9.393e20,
      ),
      new Body(
        'PALLAS',
        '#888888',
        new Position(-6.26016250504585e-1 * AU, 2.016495286691873 * AU, -3.560854227257491e-1 * AU),
        new Velocity(
          (-1.219048470897352e-2 * AU) / DAY,
          (-4.267400662950751e-3 * AU) / DAY,
          (1.673072882911492e-3 * AU) / DAY,
        ),
        2.05e20,
      ),
      new Body(
        'JUNO',
        '#888888',
        new Position(-1.34459951478234 * AU, -3.020946404952467 * AU, -5.169713347646722e-1 * AU),
        new Velocity(
          (7.591565951736826e-3 * AU) / DAY,
          (-2.794970951331517e-3 * AU) / DAY,
          (-8.164050580868809e-4 * AU) / DAY,
        ),
        2.0e19,
      ),
      new Body(
        'VESTA',
        '#888888',
        new Position(-1.777354639767897 * AU, 1.460932104845546 * AU, 8.14151564767762e-1 * AU),
        new Velocity(
          (-6.629982541090495e-3 * AU) / DAY,
          (-8.214349251492781e-3 * AU) / DAY,
          (-2.404773428447812e-3 * AU) / DAY,
        ),
        2.589e20,
      ),
      new Body(
        'LUTETIA',
        '#888888',
        new Position(6.838717911847499e-1 * AU, 2.172687452423407 * AU, 9.243197626516013e-1 * AU),
        new Velocity(
          (-9.834578451980257e-3 * AU) / DAY,
          (4.10034253278551e-3 * AU) / DAY,
          (2.38777017143441e-3 * AU) / DAY,
        ),
        1.7e18,
      ),
      new Body(
        'EUGENIA',
        '#888888',
        new Position(2.650151423618039 * AU, 1.184913537480694 * AU, 2.107353298395937e-1 * AU),
        new Velocity(
          (-3.591374365948466e-3 * AU) / DAY,
          (8.533392008683558e-3 * AU) / DAY,
          (2.975877010440758e-3 * AU) / DAY,
        ),
        6.1e18,
      ),
      new Body(
        'SIWA',
        '#888888',
        new Position(
          -7.815116061777301e-1 * AU,
          -2.025333337724603 * AU,
          -7.93569547888914e-1 * AU,
        ),
        new Velocity(
          (1.191847196835877e-2 * AU) / DAY,
          (-1.878631245371762e-3 * AU) / DAY,
          (-1.463613214835103e-3 * AU) / DAY,
        ),
        1.5e18,
      ),
      new Body(
        'IDA',
        '#888888',
        new Position(2.80754062914468 * AU, 1.115803266395256e-1 * AU, 8.630758644482572e-2 * AU),
        new Velocity(
          (-9.460951192179698e-4 * AU) / DAY,
          (9.393490729426386e-3 * AU) / DAY,
          (4.241530823374258e-3 * AU) / DAY,
        ),
        1.0e17,
      ),
      new Body(
        'MATHILDE',
        '#888888',
        new Position(4.543863801685057e-1 * AU, 2.466143694362322 * AU, 7.395885237627122e-1 * AU),
        new Velocity(
          (-9.667222335363176e-3 * AU) / DAY,
          (4.399379887502969e-3 * AU) / DAY,
          (1.327445405101748e-3 * AU) / DAY,
        ),
        1.033e17,
      ),
      new Body(
        'EROS',
        '#888888',
        new Position(1.319064491844725 * AU, -1.105240575074936 * AU, -3.900027318804698e-1 * AU),
        new Velocity(
          (6.756313509001922e-3 * AU) / DAY,
          (7.525251531575246e-3 * AU) / DAY,
          (5.49580864727223e-3 * AU) / DAY,
        ),
        6.686e15,
      ),
      new Body(
        'ICARUS',
        '#888888',
        new Position(1.007376155498536 * AU, -1.275949586887969 * AU, -1.040027833533978 * AU),
        new Velocity(
          (2.782397078470667e-3 * AU) / DAY,
          (4.855352210241711e-3 * AU) / DAY,
          (9.017065476752247e-4 * AU) / DAY,
        ),
        1.0e12,
      ),
      new Body(
        'GEOGRAPHOS',
        '#888888',
        new Position(-8.586392135728218e-1 * AU, 1.063380197901832 * AU, 1.54284611722462e-1 * AU),
        new Velocity(
          (-7.426320214847613e-3 * AU) / DAY,
          (-1.129646115230346e-2 * AU) / DAY,
          (-3.150463236733648e-3 * AU) / DAY,
        ),
        4.0e12,
      ),
      new Body(
        'APOLLO',
        '#888888',
        new Position(6.293346341912776e-2 * AU, 1.324760303221115 * AU, 7.177475127516511e-1 * AU),
        new Velocity(
          (-1.110567286908119e-2 * AU) / DAY,
          (6.860384748613327e-3 * AU) / DAY,
          (4.56006895201564e-3 * AU) / DAY,
        ),
        2.0e12,
      ),
      new Body(
        'CHIRON',
        '#888888',
        new Position(1.343299729888507e1 * AU, -8.896940452392883 * AU, -1.953060693764759 * AU),
        new Velocity(
          (3.100234627773191e-3 * AU) / DAY,
          (2.125946884890467e-3 * AU) / DAY,
          (8.583534523235937e-4 * AU) / DAY,
        ),
        4.0e18,
      ),
      new Body(
        'TOUTATIS',
        '#888888',
        new Position(-3.438555842177857 * AU, -1.708104892230376 * AU, -7.075904504997421e-1 * AU),
        new Velocity(
          (6.176893905477671e-4 * AU) / DAY,
          (-5.380810632017243e-3 * AU) / DAY,
          (-2.309138267924435e-3 * AU) / DAY,
        ),
        5.0e13,
      ),
      new Body(
        'CASTALIA',
        '#888888',
        new Position(
          8.80209053289346e-1 * AU,
          -6.715542382529721e-1 * AU,
          -3.10526187045481e-1 * AU,
        ),
        new Velocity(
          (2.9861244792126e-3 * AU) / DAY,
          (1.281918334510928e-2 * AU) / DAY,
          (7.94455809254309e-3 * AU) / DAY,
        ),
        5.0e11,
      ),
      new Body(
        'OTAWARA',
        '#888888',
        new Position(
          -1.705514832227048 * AU,
          -9.651010411985818e-1 * AU,
          -3.969390274205196e-1 * AU,
        ),
        new Velocity(
          (7.863661667048726e-3 * AU) / DAY,
          (-8.99666297428495e-3 * AU) / DAY,
          (-4.087608015469036e-3 * AU) / DAY,
        ),
        2.0e14,
      ),
      new Body(
        'ITOKAWA',
        '#888888',
        new Position(-6.287336016731144e-1 * AU, 1.117705525681768 * AU, 5.162706757356833e-1 * AU),
        new Velocity(
          (-1.04340932969657e-2 * AU) / DAY,
          (-9.045244882927284e-3 * AU) / DAY,
          (-3.728464119202186e-3 * AU) / DAY,
        ),
        3.5e10,
      ),
      new Body(
        'BENNU',
        '#888888',
        new Position(
          -1.190961322197651 * AU,
          -2.079065368223829e-1 * AU,
          -1.123139104770398e-1 * AU,
        ),
        new Velocity(
          (8.799332833017964e-5 * AU) / DAY,
          (-1.30506320079231e-2 * AU) / DAY,
          (-7.375163470676384e-3 * AU) / DAY,
        ),
        7.3e10,
      ),
      new Body(
        'MARS',
        '#FF0000',
        new Position(
          4.901509125643456e-1 * AU,
          -1.330231309136376 * AU,
          -3.991645711822979e-2 * AU,
        ),
        new Velocity(
          (1.365954790104691e-2 * AU) / DAY,
          (6.03816647265287e-3 * AU) / DAY,
          (-2.092831029639063e-4 * AU) / DAY,
        ),
        6.4185e23,
      ),
      new Body(
        'JUPITER',
        '#FFAA00',
        new Position(4.444388692766891 * AU, 2.186712866028566 * AU, -1.085938159342942e-1 * AU),
        new Velocity(
          (-3.432380929887013e-3 * AU) / DAY,
          (7.132851938106585e-3 * AU) / DAY,
          (4.732408710538558e-5 * AU) / DAY,
        ),
        1.8986e27,
      ),
      new Body(
        'SATURN',
        '#88AA00',
        new Position(6.865342768006055 * AU, 6.125039378283709 * AU, -3.795783173800661e-1 * AU),
        new Velocity(
          (-4.010952768071766e-3 * AU) / DAY,
          (4.160136553399568e-3 * AU) / DAY,
          (8.667337755719483e-5 * AU) / DAY,
        ),
        5.6846e26,
      ),
      new Body(
        'URANUS',
        '#8888FF',
        new Position(
          1.413258612883064e1 * AU,
          -1.402654126792777e1 * AU,
          -2.353477904499388e-1 * AU,
        ),
        new Velocity(
          (2.738536688457689e-3 * AU) / DAY,
          (2.616038226203874e-3 * AU) / DAY,
          (-2.58846835652284e-5 * AU) / DAY,
        ),
        1.0243e26,
      ),
      new Body(
        'NEPTUNE',
        '#0088FF',
        new Position(
          1.652586824837152e1 * AU,
          -2.518650362395328e1 * AU,
          1.378138365494216e-1 * AU,
        ),
        new Velocity(
          (2.600048932958268e-3 * AU) / DAY,
          (1.747773383296856e-3 * AU) / DAY,
          (-9.544665572340908e-5 * AU) / DAY,
        ),
        1.0243e26,
      ),
      new Body(
        'PLUTO',
        '#DDDDDD',
        new Position(-1.020944692537541e1 * AU, -2.778710134428087e1 * AU, 5.928768171513977 * AU),
        new Velocity(
          (3.019881146075932e-3 * AU) / DAY,
          (-1.561248481690909e-3 * AU) / DAY,
          (-6.944208604843255e-4 * AU) / DAY,
        ),
        1.314e22,
      ),
      new Body(
        'CHARON',
        '#777777',
        new Position(-1.020935220380775e1 * AU, -2.778703957187345e1 * AU, 5.928702083984026 * AU),
        new Velocity(
          (3.002990633157604e-3 * AU) / DAY,
          (-1.64160654334865e-3 * AU) / DAY,
          (-7.937559860442362e-4 * AU) / DAY,
        ),
        1.9e21,
      ),
      new Body(
        'ORCUS',
        '#888888',
        new Position(-4.119206419705214e1 * AU, 2.373971414934346e1 * AU, -6.741254764610292 * AU),
        new Velocity(
          (-8.752728695912848e-4 * AU) / DAY,
          (-1.703520222927894e-3 * AU) / DAY,
          (-1.074046278996527e-3 * AU) / DAY,
        ),
        6.4e20,
      ),
      new Body(
        'HAUMEA',
        '#888888',
        new Position(
          -4.185284990343197e1 * AU,
          -2.427744192143717e1 * AU,
          1.524615046182329e1 * AU,
        ),
        new Velocity(
          (1.017070320858329e-3 * AU) / DAY,
          (-1.81765138415624e-3 * AU) / DAY,
          (-6.947046020824771e-4 * AU) / DAY,
        ),
        4.01e21,
      ),
      new Body(
        'QUAOAR',
        '#888888',
        new Position(-9.216448713421947 * AU, -4.065133179726708e1 * AU, -1.151378879519627e1 * AU),
        new Velocity(
          (2.585134322943634e-3 * AU) / DAY,
          (-4.616305348999439e-4 * AU) / DAY,
          (-7.081816648737973e-5 * AU) / DAY,
        ),
        1.4e21,
      ),
      new Body(
        'MAKEMAKE',
        '#888888',
        new Position(-4.34994414278545e1 * AU, 1.171092247027552e1 * AU, 2.489911743160169e1 * AU),
        new Velocity(
          (-7.18008057426664e-4 * AU) / DAY,
          (-2.103477618239062e-3 * AU) / DAY,
          (1.746108185119412e-4 * AU) / DAY,
        ),
        3.1e21,
      ),
      new Body(
        'GONGGONG',
        '#888888',
        new Position(
          7.674928174576624e1 * AU,
          -3.562348570036968e1 * AU,
          -2.014427389201366e1 * AU,
        ),
        new Velocity(
          (1.170624868902669e-3 * AU) / DAY,
          (4.049513385277723e-4 * AU) / DAY,
          (9.180612781428067e-4 * AU) / DAY,
        ),
        1.75e21,
      ),
      new Body(
        'ERIS',
        '#888888',
        new Position(8.841627410221193e1 * AU, 3.065754191447319e1 * AU, -2.619055774928412e1 * AU),
        new Velocity(
          (-1.992584861677376e-4 * AU) / DAY,
          (9.775545417027335e-4 * AU) / DAY,
          (8.680031313822154e-4 * AU) / DAY,
        ),
        1.66e22,
      ),
      new Body(
        'SEDNA',
        '#888888',
        new Position(4.951494265641213e1 * AU, 6.971648020603577e1 * AU, 1.080897880339717e1 * AU),
        new Velocity(
          (-2.39452988692415e-3 * AU) / DAY,
          (6.118794943411146e-4 * AU) / DAY,
          (4.465364830006862e-4 * AU) / DAY,
        ),
        1.0e21,
      ),
      new Body(
        'INTERAMNIA',
        '#888888',
        new Position(-4.276455024153337e-1 * AU, 2.656811365318994 * AU, 1.192066805394195 * AU),
        new Velocity(
          (-9.775234776110819e-3 * AU) / DAY,
          (1.245176663762637e-3 * AU) / DAY,
          (-2.722773796184213e-3 * AU) / DAY,
        ),
        2.725e19,
      ),
      new Body(
        'PSYCHE',
        '#888888',
        new Position(2.361650644689909 * AU, -1.701325907542586 * AU, 2.501739277961943e-2 * AU),
        new Velocity(
          (5.988382052816191e-3 * AU) / DAY,
          (9.149614664873013e-3 * AU) / DAY,
          (-5.897546674996498e-4 * AU) / DAY,
        ),
        2.725e19,
      ),
      new Body(
        'KALLIOPE',
        '#888888',
        new Position(1.214900531417854 * AU, 2.139287284908385 * AU, 8.784378554381741e-1 * AU),
        new Velocity(
          (-9.601492755486031e-3 * AU) / DAY,
          (3.596713256388067e-3 * AU) / DAY,
          (4.441098591168799e-3 * AU) / DAY,
        ),
        8.16e18,
      ),
    ];

    timer = setTimeout(MoveAll, 10);

    return () => {
      clearTimeout(timer);
    };
  });

  return <div ref={div} className={css.space} />;
};

/* eslint-disable react/no-this-in-sfc */
/* eslint-disable space-in-parens */
/* eslint-disable max-len */
import React from 'react';
import css   from './NBody.css';

export const NBody: React.FC = () => {
    const div = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        let timer: NodeJS.Timer;

        const AU            = 1.49598e+11;          //Astronomical Unit (distance between earth in sun)
        const G             = 6.6743015e-11;        //Constant of Gravity
        const DAY           = 24 * 60 * 60;
        const TIMESCALE     = 1000;
        const GRAVITYSCALE  = 100;

        const centerX    = div.current!.offsetWidth  / 2;
        const centerY    = div.current!.offsetHeight / 2;

        class Velocity {
            public x: number;
            public y: number;

            constructor(x: number, y: number, _z?: number) {
                this.x = x;
                this.y = y;
            }

            public accelerate(a: Velocity) {
                this.x += a.x;
                this.y += a.y;
            }

            public times(a: number) {
                return new Velocity(this.x * a, this.y * a);
            }
        }

        class Position {
            public x: number;
            public y: number;

            constructor(x: number, y: number, _z?: number) {
                this.x = x;
                this.y = y;
            }

            public move(v: Velocity) {
                this.x += v.x;
                this.y += v.y;
            }

            public centerOn(p: Position) {
                this.x -= p.x;
                this.y -= p.y;
            }

            public distance(p: Position) {
                const deltaX = this.x - p.x;
                const deltaY = this.y - p.y;

                return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
            }
        }

        class Body {
            public position:        Position;
            public velocity:        Velocity;
            public mass:            number;

            public element:         HTMLDivElement;
            public thumb:           unknown;

            public trails:          HTMLDivElement[];
            public trailptr:        number;

            public name:            string;

            constructor(name: string, color: string, position: Position, velocity: Velocity, mass: number) {
                this.position   = position;
                this.velocity   = velocity;
                this.mass       = mass;

                this.thumb      = null;

                this.element                    = div.current!.appendChild(document.createElement('div'));
                this.element.style.position     = 'absolute';
                this.element.innerHTML          = `● ${name}`;
                this.element.style.color        = color;
                this.element.style.visibility   = 'hidden';

                this.trails     = new Array(100).fill(null).map(() => {
                    const trail = div.current!.appendChild(document.createElement('div'));
                    trail.style.position        = 'absolute';
                    trail.innerHTML             = '·';
                    trail.style.color           = color;
                    trail.style.visibility      = 'hidden';
                    return trail;
                });
                this.trailptr   = 0;
                this.name       = name;
            }

            public distance(p: Position) {
                return this.position.distance(p);
            }

            public gravity(b: Body) {
                const deltaX    = b.position.x - this.position.x;
                const deltaY    = b.position.y - this.position.y;
                const distance  = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
                const accel     = (G / (distance * distance)) * b.mass;
                const vX        = (deltaX / distance) * accel;
                const vY        = (deltaY / distance) * accel;
                return new Velocity(vX, vY);
            }

            public plot() {
                const x = Math.round(centerX + (this.position.x * 250 / AU));
                const y = Math.round(centerY - (this.position.y * 250 / AU));

                this.trails[this.trailptr].style.visibility    = 'visible';
                this.trails[this.trailptr].style.left          = `${x}px`;
                this.trails[this.trailptr].style.top           = `${y}px`;

                this.trailptr = (this.trailptr + 1) % 100;

                this.element.style.visibility   = 'visible';
                this.element.style.left         = `${x}px`;
                this.element.style.top          = `${y}px`;
            }

            public destroy() {
                for(const trail of this.trails)  div.current!.removeChild(trail);
                div.current!.removeChild(this.element);
            }

            public move(a = 1) {
                this.position.move(this.velocity.times(a));
            }
        }

        function MoveAll() {
            for(let i = 0; i < TIMESCALE; i++) {
                for(const body1 of bodies) {
                    for(const body2 of bodies) {
                        if(body1 !== body2)
                            body1.velocity.accelerate(body1.gravity(body2).times(GRAVITYSCALE));
                    }
                }

                for(const body of bodies) body.move(GRAVITYSCALE);
            }

            // Recenter everything on the sun
            const sun = bodies[0].position;
            for(const body of bodies) body.position.centerOn(sun);

            for(const body of bodies) body.plot();

            timer = setTimeout(MoveAll, 100);
        }

        const bodies =
        [
            new Body('SUN',         '#FFFFFF', new Position( 0.000000000000000e+00 * AU,  0.000000000000000e+00 * AU,  0.000000000000000e+00 * AU), new Velocity( 0.000000000000000e+00 * AU / DAY,  0.000000000000000e+00 * AU / DAY,  0.000000000000000e+00 * AU / DAY), 1.9891e30),
            new Body('MERCURY',     '#00FF00', new Position(-3.984991668595178e-01 * AU, -2.561928340514160e-02 * AU,  3.377976514394734e-02 * AU), new Velocity(-4.011712561002649e-03 * AU / DAY, -2.686224938128134e-02 * AU / DAY, -1.826155960106947e-03 * AU / DAY), 3.3020e23),
            new Body('VENUS',       '#FFFF00', new Position( 7.230330310210821e-01 * AU,  5.504058230745216e-02 * AU, -4.098086643873699e-02 * AU), new Velocity(-1.616722836816922e-03 * AU / DAY,  2.007557233161879e-02 * AU / DAY,  3.676760074327269e-04 * AU / DAY), 4.8685e24),
            new Body('EARTH',       '#0000FF', new Position( 9.904302637648870e-01 * AU, -1.784568222691539e-01 * AU, -4.711847852404750e-06 * AU), new Velocity( 2.767612493924405e-03 * AU / DAY,  1.687358983367364e-02 * AU / DAY, -2.060413162155120e-07 * AU / DAY), 5.9736e24),
            new Body('LUNA',        '#CCCCCC', new Position( 9.880635743981107e-01 * AU, -1.796271733664833e-01 * AU,  2.247808149105485e-04 * AU), new Velocity( 3.000517036102636e-03 * AU / DAY,  1.634972428232062e-02 * AU / DAY,  1.617217556214179e-05 * AU / DAY), 7.3490e22),
            new Body('CERES',       '#888888', new Position( 2.732617277025615e+00 * AU,  7.734822664676754e-01 * AU, -9.207592896905449e-01 * AU), new Velocity( 3.368590810386608e-03 * AU / DAY,  8.330863405401928e-03 * AU / DAY,  3.238410491551668e-03 * AU / DAY), 9.3930e20),
            new Body('PALLAS',      '#888888', new Position(-6.260162505045850e-01 * AU,  2.016495286691873e+00 * AU, -3.560854227257491e-01 * AU), new Velocity(-1.219048470897352e-02 * AU / DAY, -4.267400662950751e-03 * AU / DAY,  1.673072882911492e-03 * AU / DAY), 2.0500e20),
            new Body('JUNO',        '#888888', new Position(-1.344599514782340e+00 * AU, -3.020946404952467e+00 * AU, -5.169713347646722e-01 * AU), new Velocity( 7.591565951736826e-03 * AU / DAY, -2.794970951331517e-03 * AU / DAY, -8.164050580868809e-04 * AU / DAY), 2.0000e19),
            new Body('VESTA',       '#888888', new Position(-1.777354639767897e+00 * AU,  1.460932104845546e+00 * AU,  8.141515647677620e-01 * AU), new Velocity(-6.629982541090495e-03 * AU / DAY, -8.214349251492781e-03 * AU / DAY, -2.404773428447812e-03 * AU / DAY), 2.5890e20),
            new Body('LUTETIA',     '#888888', new Position( 6.838717911847499e-01 * AU,  2.172687452423407e+00 * AU,  9.243197626516013e-01 * AU), new Velocity(-9.834578451980257e-03 * AU / DAY,  4.100342532785510e-03 * AU / DAY,  2.387770171434410e-03 * AU / DAY), 1.7000e18),
            new Body('EUGENIA',     '#888888', new Position( 2.650151423618039e+00 * AU,  1.184913537480694e+00 * AU,  2.107353298395937e-01 * AU), new Velocity(-3.591374365948466e-03 * AU / DAY,  8.533392008683558e-03 * AU / DAY,  2.975877010440758e-03 * AU / DAY), 6.1000e18),
            new Body('SIWA',        '#888888', new Position(-7.815116061777301e-01 * AU, -2.025333337724603e+00 * AU, -7.935695478889140e-01 * AU), new Velocity( 1.191847196835877e-02 * AU / DAY, -1.878631245371762e-03 * AU / DAY, -1.463613214835103e-03 * AU / DAY), 1.5000e18),
            new Body('IDA',         '#888888', new Position( 2.807540629144680e+00 * AU,  1.115803266395256e-01 * AU,  8.630758644482572e-02 * AU), new Velocity(-9.460951192179698e-04 * AU / DAY,  9.393490729426386e-03 * AU / DAY,  4.241530823374258e-03 * AU / DAY), 1.0000e17),
            new Body('MATHILDE',    '#888888', new Position( 4.543863801685057e-01 * AU,  2.466143694362322e+00 * AU,  7.395885237627122e-01 * AU), new Velocity(-9.667222335363176e-03 * AU / DAY,  4.399379887502969e-03 * AU / DAY,  1.327445405101748e-03 * AU / DAY), 1.0330e17),
            new Body('EROS',        '#888888', new Position( 1.319064491844725e+00 * AU, -1.105240575074936e+00 * AU, -3.900027318804698e-01 * AU), new Velocity( 6.756313509001922e-03 * AU / DAY,  7.525251531575246e-03 * AU / DAY,  5.495808647272230e-03 * AU / DAY), 6.6860e15),
            new Body('ICARUS',      '#888888', new Position( 1.007376155498536e+00 * AU, -1.275949586887969e+00 * AU, -1.040027833533978e+00 * AU), new Velocity( 2.782397078470667e-03 * AU / DAY,  4.855352210241711e-03 * AU / DAY,  9.017065476752247e-04 * AU / DAY), 1.0000e12),
            new Body('GEOGRAPHOS',  '#888888', new Position(-8.586392135728218e-01 * AU,  1.063380197901832e+00 * AU,  1.542846117224620e-01 * AU), new Velocity(-7.426320214847613e-03 * AU / DAY, -1.129646115230346e-02 * AU / DAY, -3.150463236733648e-03 * AU / DAY), 4.0000e12),
            new Body('APOLLO',      '#888888', new Position( 6.293346341912776e-02 * AU,  1.324760303221115e+00 * AU,  7.177475127516511e-01 * AU), new Velocity(-1.110567286908119e-02 * AU / DAY,  6.860384748613327e-03 * AU / DAY,  4.560068952015640e-03 * AU / DAY), 2.0000e12),
            new Body('CHIRON',      '#888888', new Position( 1.343299729888507e+01 * AU, -8.896940452392883e+00 * AU, -1.953060693764759e+00 * AU), new Velocity( 3.100234627773191e-03 * AU / DAY,  2.125946884890467e-03 * AU / DAY,  8.583534523235937e-04 * AU / DAY), 4.0000e18),
            new Body('TOUTATIS',    '#888888', new Position(-3.438555842177857e+00 * AU, -1.708104892230376e+00 * AU, -7.075904504997421e-01 * AU), new Velocity( 6.176893905477671e-04 * AU / DAY, -5.380810632017243e-03 * AU / DAY, -2.309138267924435e-03 * AU / DAY), 5.0000e13),
            new Body('CASTALIA',    '#888888', new Position( 8.802090532893460e-01 * AU, -6.715542382529721e-01 * AU, -3.105261870454810e-01 * AU), new Velocity( 2.986124479212600e-03 * AU / DAY,  1.281918334510928e-02 * AU / DAY,  7.944558092543090e-03 * AU / DAY), 5.0000e11),
            new Body('OTAWARA',     '#888888', new Position(-1.705514832227048e+00 * AU, -9.651010411985818e-01 * AU, -3.969390274205196e-01 * AU), new Velocity( 7.863661667048726e-03 * AU / DAY, -8.996662974284950e-03 * AU / DAY, -4.087608015469036e-03 * AU / DAY), 2.0000e14),
            new Body('ITOKAWA',     '#888888', new Position(-6.287336016731144e-01 * AU,  1.117705525681768e+00 * AU,  5.162706757356833e-01 * AU), new Velocity(-1.043409329696570e-02 * AU / DAY, -9.045244882927284e-03 * AU / DAY, -3.728464119202186e-03 * AU / DAY), 3.5000e10),
            new Body('BENNU',       '#888888', new Position(-1.190961322197651e+00 * AU, -2.079065368223829e-01 * AU, -1.123139104770398e-01 * AU), new Velocity( 8.799332833017964e-05 * AU / DAY, -1.305063200792310e-02 * AU / DAY, -7.375163470676384e-03 * AU / DAY), 7.3000e10),
            new Body('MARS',        '#FF0000', new Position( 4.901509125643456e-01 * AU, -1.330231309136376e+00 * AU, -3.991645711822979e-02 * AU), new Velocity( 1.365954790104691e-02 * AU / DAY,  6.038166472652870e-03 * AU / DAY, -2.092831029639063e-04 * AU / DAY), 6.4185e23),
            new Body('JUPITER',     '#FFAA00', new Position( 4.444388692766891e+00 * AU,  2.186712866028566e+00 * AU, -1.085938159342942e-01 * AU), new Velocity(-3.432380929887013e-03 * AU / DAY,  7.132851938106585e-03 * AU / DAY,  4.732408710538558e-05 * AU / DAY), 1.8986e27),
            new Body('SATURN',      '#88AA00', new Position( 6.865342768006055e+00 * AU,  6.125039378283709e+00 * AU, -3.795783173800661e-01 * AU), new Velocity(-4.010952768071766e-03 * AU / DAY,  4.160136553399568e-03 * AU / DAY,  8.667337755719483e-05 * AU / DAY), 5.6846e26),
            new Body('URANUS',      '#8888FF', new Position( 1.413258612883064e+01 * AU, -1.402654126792777e+01 * AU, -2.353477904499388e-01 * AU), new Velocity( 2.738536688457689e-03 * AU / DAY,  2.616038226203874e-03 * AU / DAY, -2.588468356522840e-05 * AU / DAY), 1.0243e26),
            new Body('NEPTUNE',     '#0088FF', new Position( 1.652586824837152e+01 * AU, -2.518650362395328e+01 * AU,  1.378138365494216e-01 * AU), new Velocity( 2.600048932958268e-03 * AU / DAY,  1.747773383296856e-03 * AU / DAY, -9.544665572340908e-05 * AU / DAY), 1.0243e26),
            new Body('PLUTO',       '#DDDDDD', new Position(-1.020944692537541e+01 * AU, -2.778710134428087e+01 * AU,  5.928768171513977e+00 * AU), new Velocity( 3.019881146075932e-03 * AU / DAY, -1.561248481690909e-03 * AU / DAY, -6.944208604843255e-04 * AU / DAY), 1.3140e22),
            new Body('CHARON',      '#777777', new Position(-1.020935220380775e+01 * AU, -2.778703957187345e+01 * AU,  5.928702083984026e+00 * AU), new Velocity( 3.002990633157604e-03 * AU / DAY, -1.641606543348650e-03 * AU / DAY, -7.937559860442362e-04 * AU / DAY), 1.9000e21),
            new Body('ORCUS',       '#888888', new Position(-4.119206419705214e+01 * AU,  2.373971414934346e+01 * AU, -6.741254764610292e+00 * AU), new Velocity(-8.752728695912848e-04 * AU / DAY, -1.703520222927894e-03 * AU / DAY, -1.074046278996527e-03 * AU / DAY), 6.4000e20),
            new Body('HAUMEA',      '#888888', new Position(-4.185284990343197e+01 * AU, -2.427744192143717e+01 * AU,  1.524615046182329e+01 * AU), new Velocity( 1.017070320858329e-03 * AU / DAY, -1.817651384156240e-03 * AU / DAY, -6.947046020824771e-04 * AU / DAY), 4.0100e21),
            new Body('QUAOAR',      '#888888', new Position(-9.216448713421947e+00 * AU, -4.065133179726708e+01 * AU, -1.151378879519627e+01 * AU), new Velocity( 2.585134322943634e-03 * AU / DAY, -4.616305348999439e-04 * AU / DAY, -7.081816648737973e-05 * AU / DAY), 1.4000e21),
            new Body('MAKEMAKE',    '#888888', new Position(-4.349944142785450e+01 * AU,  1.171092247027552e+01 * AU,  2.489911743160169e+01 * AU), new Velocity(-7.180080574266640e-04 * AU / DAY, -2.103477618239062e-03 * AU / DAY,  1.746108185119412e-04 * AU / DAY), 3.1000e21),
            new Body('GONGGONG',    '#888888', new Position( 7.674928174576624e+01 * AU, -3.562348570036968e+01 * AU, -2.014427389201366e+01 * AU), new Velocity( 1.170624868902669e-03 * AU / DAY,  4.049513385277723e-04 * AU / DAY,  9.180612781428067e-04 * AU / DAY), 1.7500e21),
            new Body('ERIS',        '#888888', new Position( 8.841627410221193e+01 * AU,  3.065754191447319e+01 * AU, -2.619055774928412e+01 * AU), new Velocity(-1.992584861677376e-04 * AU / DAY,  9.775545417027335e-04 * AU / DAY,  8.680031313822154e-04 * AU / DAY), 1.6600e22),
            new Body('SEDNA',       '#888888', new Position( 4.951494265641213e+01 * AU,  6.971648020603577e+01 * AU,  1.080897880339717e+01 * AU), new Velocity(-2.394529886924150e-03 * AU / DAY,  6.118794943411146e-04 * AU / DAY,  4.465364830006862e-04 * AU / DAY), 1.0000e21),
            new Body('INTERAMNIA',  '#888888', new Position(-4.276455024153337e-01 * AU,  2.656811365318994e+00 * AU,  1.192066805394195e+00 * AU), new Velocity(-9.775234776110819e-03 * AU / DAY,  1.245176663762637e-03 * AU / DAY, -2.722773796184213e-03 * AU / DAY), 2.7250e19),
            new Body('PSYCHE',      '#888888', new Position( 2.361650644689909e+00 * AU, -1.701325907542586e+00 * AU,  2.501739277961943e-02 * AU), new Velocity( 5.988382052816191e-03 * AU / DAY,  9.149614664873013e-03 * AU / DAY, -5.897546674996498e-04 * AU / DAY), 2.7250e19),
            new Body('KALLIOPE',    '#888888', new Position( 1.214900531417854e+00 * AU,  2.139287284908385e+00 * AU,  8.784378554381741e-01 * AU), new Velocity(-9.601492755486031e-03 * AU / DAY,  3.596713256388067e-03 * AU / DAY,  4.441098591168799e-03 * AU / DAY), 8.1600e18),
        ];

        timer = setTimeout(MoveAll, 10);

        return () => { clearTimeout(timer); };
    });

    return (
        <div ref={div} className={css.space} />
    );
};

export default NBody;

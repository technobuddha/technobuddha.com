import React from 'react';
import css   from './NBody.module.css';

export const NBody: React.FC = () => {
    const div = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        let timer: NodeJS.Timer;

        const AU	        = 1.49598E+11;								//m = Astronomical Unit (distance between earth in sun)
        const G	            = 6.6743015E-11;        //Constant of Gravity
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

                this.element	= div.current!.appendChild(document.createElement('div'));
                this.element.style.position		= 'absolute';
                this.element.innerHTML			= `● ${name}`;
                this.element.style.color        = color;
                this.element.style.visibility	= 'hidden';

                this.trails     = Array(100).fill(null).map(() => {
                    const trail = div.current!.appendChild(document.createElement('div'));
                    trail.style.position	    = 'absolute';
                    trail.innerHTML		        = '·';
                    trail.style.color           = color;
                    trail.style.visibility	    = 'hidden';
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

                this.trails[this.trailptr].style.visibility	   = 'visible';
                this.trails[this.trailptr].style.left          = `${x}px`;
                this.trails[this.trailptr].style.top           = `${y}px`;

                this.trailptr = (this.trailptr + 1) % 100;

                this.element.style.visibility	= 'visible';
                this.element.style.left			= `${x}px`;
                this.element.style.top			= `${y}px`;
            }

            public destroy() {
                this.trails.forEach(trail => div.current!.removeChild(trail));
                div.current!.removeChild(this.element);
            }

            public move(a = 1) {
                this.position.move(this.velocity.times(a));
            }
        }

        function MoveAll() {
            for(let i = 0; i < TIMESCALE; i++) {
                bodies.forEach(body1 => {
                    bodies.forEach(body2 => {
                        if(body1 !== body2) {
                            body1.velocity.accelerate(body1.gravity(body2).times(GRAVITYSCALE));
                        }
                    });
                });

                bodies.forEach(body => body.move(GRAVITYSCALE));
            }

            // Recenter everything on the sun
            const sun = bodies[0].position;
            bodies.forEach(body => body.position.centerOn(sun));

            bodies.forEach(body => body.plot());

            timer = setTimeout(MoveAll, 100);
        }

        const bodies =
        [
            new Body('SUN',         '#FFFFFF', new Position( 0.000000000000000E+00 * AU,  0.000000000000000E+00 * AU,  0.000000000000000E+00 * AU), new Velocity( 0.000000000000000E+00 * AU / DAY,  0.000000000000000E+00 * AU / DAY,  0.000000000000000E+00 * AU / DAY), 1.9891E30),
            new Body('MERCURY',     '#00FF00', new Position(-3.984991668595178E-01 * AU, -2.561928340514160E-02 * AU,  3.377976514394734E-02 * AU), new Velocity(-4.011712561002649E-03 * AU / DAY, -2.686224938128134E-02 * AU / DAY, -1.826155960106947E-03 * AU / DAY), 3.3020E23),
            new Body('VENUS',       '#FFFF00', new Position( 7.230330310210821E-01 * AU,  5.504058230745216E-02 * AU, -4.098086643873699E-02 * AU), new Velocity(-1.616722836816922E-03 * AU / DAY,  2.007557233161879E-02 * AU / DAY,  3.676760074327269E-04 * AU / DAY), 4.8685E24),
            new Body('EARTH',       '#0000FF', new Position( 9.904302637648870E-01 * AU, -1.784568222691539E-01 * AU, -4.711847852404750E-06 * AU), new Velocity( 2.767612493924405E-03 * AU / DAY,  1.687358983367364E-02 * AU / DAY, -2.060413162155120E-07 * AU / DAY), 5.9736E24),
            new Body('LUNA',        '#CCCCCC', new Position( 9.880635743981107E-01 * AU, -1.796271733664833E-01 * AU,  2.247808149105485E-04 * AU), new Velocity( 3.000517036102636E-03 * AU / DAY,  1.634972428232062E-02 * AU / DAY,  1.617217556214179E-05 * AU / DAY), 7.3490E22),
            new Body('CERES',		'#888888', new Position( 2.732617277025615E+00 * AU,  7.734822664676754E-01 * AU, -9.207592896905449E-01 * AU), new Velocity( 3.368590810386608E-03 * AU / DAY,  8.330863405401928E-03 * AU / DAY,  3.238410491551668E-03 * AU / DAY), 9.3930E20),
            new Body('PALLAS',		'#888888', new Position(-6.260162505045850E-01 * AU,  2.016495286691873E+00 * AU, -3.560854227257491E-01 * AU), new Velocity(-1.219048470897352E-02 * AU / DAY, -4.267400662950751E-03 * AU / DAY,  1.673072882911492E-03 * AU / DAY), 2.0500E20),
            new Body('JUNO',		'#888888', new Position(-1.344599514782340E+00 * AU, -3.020946404952467E+00 * AU, -5.169713347646722E-01 * AU), new Velocity( 7.591565951736826E-03 * AU / DAY, -2.794970951331517E-03 * AU / DAY, -8.164050580868809E-04 * AU / DAY), 2.0000E19),
            new Body('VESTA',		'#888888', new Position(-1.777354639767897E+00 * AU,  1.460932104845546E+00 * AU,  8.141515647677620E-01 * AU), new Velocity(-6.629982541090495E-03 * AU / DAY, -8.214349251492781E-03 * AU / DAY, -2.404773428447812E-03 * AU / DAY), 2.5890E20),
            new Body('LUTETIA',		'#888888', new Position( 6.838717911847499E-01 * AU,  2.172687452423407E+00 * AU,  9.243197626516013E-01 * AU), new Velocity(-9.834578451980257E-03 * AU / DAY,  4.100342532785510E-03 * AU / DAY,  2.387770171434410E-03 * AU / DAY), 1.7000E18),
            new Body('EUGENIA',		'#888888', new Position( 2.650151423618039E+00 * AU,  1.184913537480694E+00 * AU,  2.107353298395937E-01 * AU), new Velocity(-3.591374365948466E-03 * AU / DAY,  8.533392008683558E-03 * AU / DAY,  2.975877010440758E-03 * AU / DAY), 6.1000E18),
            new Body('SIWA',		'#888888', new Position(-7.815116061777301E-01 * AU, -2.025333337724603E+00 * AU, -7.935695478889140E-01 * AU), new Velocity( 1.191847196835877E-02 * AU / DAY, -1.878631245371762E-03 * AU / DAY, -1.463613214835103E-03 * AU / DAY), 1.5000E18),
            new Body('IDA',			'#888888', new Position( 2.807540629144680E+00 * AU,  1.115803266395256E-01 * AU,  8.630758644482572E-02 * AU), new Velocity(-9.460951192179698E-04 * AU / DAY,  9.393490729426386E-03 * AU / DAY,  4.241530823374258E-03 * AU / DAY), 1.0000E17),
            new Body('MATHILDE',	'#888888', new Position( 4.543863801685057E-01 * AU,  2.466143694362322E+00 * AU,  7.395885237627122E-01 * AU), new Velocity(-9.667222335363176E-03 * AU / DAY,  4.399379887502969E-03 * AU / DAY,  1.327445405101748E-03 * AU / DAY), 1.0330E17),
            new Body('EROS',		'#888888', new Position( 1.319064491844725E+00 * AU, -1.105240575074936E+00 * AU, -3.900027318804698E-01 * AU), new Velocity( 6.756313509001922E-03 * AU / DAY,  7.525251531575246E-03 * AU / DAY,  5.495808647272230E-03 * AU / DAY), 6.6860E15),
            new Body('ICARUS',		'#888888', new Position( 1.007376155498536E+00 * AU, -1.275949586887969E+00 * AU, -1.040027833533978E+00 * AU), new Velocity( 2.782397078470667E-03 * AU / DAY,  4.855352210241711E-03 * AU / DAY,  9.017065476752247E-04 * AU / DAY), 1.0000E12),
            new Body('GEOGRAPHOS',	'#888888', new Position(-8.586392135728218E-01 * AU,  1.063380197901832E+00 * AU,  1.542846117224620E-01 * AU), new Velocity(-7.426320214847613E-03 * AU / DAY, -1.129646115230346E-02 * AU / DAY, -3.150463236733648E-03 * AU / DAY), 4.0000E12),
            new Body('APOLLO',		'#888888', new Position( 6.293346341912776E-02 * AU,  1.324760303221115E+00 * AU,  7.177475127516511E-01 * AU), new Velocity(-1.110567286908119E-02 * AU / DAY,  6.860384748613327E-03 * AU / DAY,  4.560068952015640E-03 * AU / DAY), 2.0000E12),
            new Body('CHIRON',		'#888888', new Position( 1.343299729888507E+01 * AU, -8.896940452392883E+00 * AU, -1.953060693764759E+00 * AU), new Velocity( 3.100234627773191E-03 * AU / DAY,  2.125946884890467E-03 * AU / DAY,  8.583534523235937E-04 * AU / DAY), 4.0000E18),
            new Body('TOUTATIS',	'#888888', new Position(-3.438555842177857E+00 * AU, -1.708104892230376E+00 * AU, -7.075904504997421E-01 * AU), new Velocity( 6.176893905477671E-04 * AU / DAY, -5.380810632017243E-03 * AU / DAY, -2.309138267924435E-03 * AU / DAY), 5.0000E13),
            new Body('CASTALIA',	'#888888', new Position( 8.802090532893460E-01 * AU, -6.715542382529721E-01 * AU, -3.105261870454810E-01 * AU), new Velocity( 2.986124479212600E-03 * AU / DAY,  1.281918334510928E-02 * AU / DAY,  7.944558092543090E-03 * AU / DAY), 5.0000E11),
            new Body('OTAWARA',		'#888888', new Position(-1.705514832227048E+00 * AU, -9.651010411985818E-01 * AU, -3.969390274205196E-01 * AU), new Velocity( 7.863661667048726E-03 * AU / DAY, -8.996662974284950E-03 * AU / DAY, -4.087608015469036E-03 * AU / DAY), 2.0000E14),
            new Body('ITOKAWA',		'#888888', new Position(-6.287336016731144E-01 * AU,  1.117705525681768E+00 * AU,  5.162706757356833E-01 * AU), new Velocity(-1.043409329696570E-02 * AU / DAY, -9.045244882927284E-03 * AU / DAY, -3.728464119202186E-03 * AU / DAY), 3.5000E10),
            new Body('BENNU',		'#888888', new Position(-1.190961322197651E+00 * AU, -2.079065368223829E-01 * AU, -1.123139104770398E-01 * AU), new Velocity( 8.799332833017964E-05 * AU / DAY, -1.305063200792310E-02 * AU / DAY, -7.375163470676384E-03 * AU / DAY), 7.3000E10),
            new Body('MARS',		'#FF0000', new Position( 4.901509125643456E-01 * AU, -1.330231309136376E+00 * AU, -3.991645711822979E-02 * AU), new Velocity( 1.365954790104691E-02 * AU / DAY,  6.038166472652870E-03 * AU / DAY, -2.092831029639063E-04 * AU / DAY), 6.4185E23),
            new Body('JUPITER',		'#FFAA00', new Position( 4.444388692766891E+00 * AU,  2.186712866028566E+00 * AU, -1.085938159342942E-01 * AU), new Velocity(-3.432380929887013E-03 * AU / DAY,  7.132851938106585E-03 * AU / DAY,  4.732408710538558E-05 * AU / DAY), 1.8986E27),
            new Body('SATURN',		'#88AA00', new Position( 6.865342768006055E+00 * AU,  6.125039378283709E+00 * AU, -3.795783173800661E-01 * AU), new Velocity(-4.010952768071766E-03 * AU / DAY,  4.160136553399568E-03 * AU / DAY,  8.667337755719483E-05 * AU / DAY), 5.6846E26),
            new Body('URANUS',		'#8888FF', new Position( 1.413258612883064E+01 * AU, -1.402654126792777E+01 * AU, -2.353477904499388E-01 * AU), new Velocity( 2.738536688457689E-03 * AU / DAY,  2.616038226203874E-03 * AU / DAY, -2.588468356522840E-05 * AU / DAY), 1.0243E26),
            new Body('NEPTUNE', 	'#0088FF', new Position( 1.652586824837152E+01 * AU, -2.518650362395328E+01 * AU,  1.378138365494216E-01 * AU), new Velocity( 2.600048932958268E-03 * AU / DAY,  1.747773383296856E-03 * AU / DAY, -9.544665572340908E-05 * AU / DAY), 1.0243E26),
            new Body('PLUTO',		'#DDDDDD', new Position(-1.020944692537541E+01 * AU, -2.778710134428087E+01 * AU,  5.928768171513977E+00 * AU), new Velocity( 3.019881146075932E-03 * AU / DAY, -1.561248481690909E-03 * AU / DAY, -6.944208604843255E-04 * AU / DAY), 1.3140E22),
            new Body('CHARON', 		'#777777', new Position(-1.020935220380775E+01 * AU, -2.778703957187345E+01 * AU,  5.928702083984026E+00 * AU), new Velocity( 3.002990633157604E-03 * AU / DAY, -1.641606543348650E-03 * AU / DAY, -7.937559860442362E-04 * AU / DAY), 1.9000E21),
            new Body('ORCUS',		'#888888', new Position(-4.119206419705214E+01 * AU,  2.373971414934346E+01 * AU, -6.741254764610292E+00 * AU), new Velocity(-8.752728695912848E-04 * AU / DAY, -1.703520222927894E-03 * AU / DAY, -1.074046278996527E-03 * AU / DAY), 6.4000E20),
            new Body('HAUMEA',		'#888888', new Position(-4.185284990343197E+01 * AU, -2.427744192143717E+01 * AU,  1.524615046182329E+01 * AU), new Velocity( 1.017070320858329E-03 * AU / DAY, -1.817651384156240E-03 * AU / DAY, -6.947046020824771E-04 * AU / DAY), 4.0100E21),
            new Body('QUAOAR',		'#888888', new Position(-9.216448713421947E+00 * AU, -4.065133179726708E+01 * AU, -1.151378879519627E+01 * AU), new Velocity( 2.585134322943634E-03 * AU / DAY, -4.616305348999439E-04 * AU / DAY, -7.081816648737973E-05 * AU / DAY), 1.4000E21),
            new Body('MAKEMAKE',	'#888888', new Position(-4.349944142785450E+01 * AU,  1.171092247027552E+01 * AU,  2.489911743160169E+01 * AU), new Velocity(-7.180080574266640E-04 * AU / DAY, -2.103477618239062E-03 * AU / DAY,  1.746108185119412E-04 * AU / DAY), 3.1000E21),
            new Body('GONGGONG',	'#888888', new Position( 7.674928174576624E+01 * AU, -3.562348570036968E+01 * AU, -2.014427389201366E+01 * AU), new Velocity( 1.170624868902669E-03 * AU / DAY,  4.049513385277723E-04 * AU / DAY,  9.180612781428067E-04 * AU / DAY), 1.7500E21),
            new Body('ERIS',		'#888888', new Position( 8.841627410221193E+01 * AU,  3.065754191447319E+01 * AU, -2.619055774928412E+01 * AU), new Velocity(-1.992584861677376E-04 * AU / DAY,  9.775545417027335E-04 * AU / DAY,  8.680031313822154E-04 * AU / DAY), 1.6600E22),
            new Body('SEDNA',		'#888888', new Position( 4.951494265641213E+01 * AU,  6.971648020603577E+01 * AU,  1.080897880339717E+01 * AU), new Velocity(-2.394529886924150E-03 * AU / DAY,  6.118794943411146E-04 * AU / DAY,  4.465364830006862E-04 * AU / DAY), 1.0000E21),
            new Body('INTERAMNIA',	'#888888', new Position(-4.276455024153337E-01 * AU,  2.656811365318994E+00 * AU,  1.192066805394195E+00 * AU), new Velocity(-9.775234776110819E-03 * AU / DAY,  1.245176663762637E-03 * AU / DAY, -2.722773796184213E-03 * AU / DAY), 2.7250E19),
            new Body('PSYCHE',		'#888888', new Position( 2.361650644689909E+00 * AU, -1.701325907542586E+00 * AU,  2.501739277961943E-02 * AU), new Velocity( 5.988382052816191E-03 * AU / DAY,  9.149614664873013E-03 * AU / DAY, -5.897546674996498E-04 * AU / DAY), 2.7250E19),
            new Body('KALLIOPE',	'#888888', new Position( 1.214900531417854E+00 * AU,  2.139287284908385E+00 * AU,  8.784378554381741E-01 * AU), new Velocity(-9.601492755486031E-03 * AU / DAY,  3.596713256388067E-03 * AU / DAY,  4.441098591168799E-03 * AU / DAY), 8.1600E18),
        ];

        timer = setTimeout(MoveAll, 10);

        return () => clearTimeout(timer);
    });

    return (
        <div ref={div} className={css.space}>
        </div>
    );
};

export default NBody;

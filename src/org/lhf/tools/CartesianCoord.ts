class CartesianCoord {
    public x: number;
    public y: number;
    public z: number;
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    clone(): CartesianCoord {
        return new CartesianCoord(this.x, this.y, this.z);
    }

    copyTo(n: CartesianCoord): void {
        n.x = this.x;
        n.y = this.y;
        n.z = this.z;
    }

    copyFrom(n: CartesianCoord): void {
        this.x = n.x;
        this.y = n.y;
        this.z = n.z;
    }

    reset(newx: number = 0, newy: number = 0, newz: number = 0): void {
        this.x = newx;
        this.y = newy;
        this.z = newz;
    }

    static get ZERO(): CartesianCoord {
        return new CartesianCoord(0, 0, 0);
    }

}

class SphericalCoord {
    public radius: number;
    public theta: number;
    public phi: number;
    constructor(radius: number = 0, theta: number = 0, phi: number = 0) {
        this.radius = radius;
        this.theta = theta;
        this.phi = phi;
    }

    clone(): SphericalCoord {
        return new SphericalCoord(this.radius, this.theta, this.phi);
    }

    copyTo(n: SphericalCoord): void {
        n.radius = this.radius;
        n.theta = this.theta;
        n.phi = this.phi;
    }

    copyFrom(n: SphericalCoord): void {
        this.radius = n.radius;
        this.theta = n.theta;
        this.phi = n.phi;
    }

    reset(newradius: number = 0, newtheta: number = 0, newphi: number = 0): void {
        this.radius = newradius;
        this.theta = newtheta;
        this.phi = newphi;
    }
    static get ZERO(): SphericalCoord {
        return new SphericalCoord(0, 0, 0);
    }
}
class CoordsTransform {
    constructor() {

    }
    static CartesianToSpherical(coord: CartesianCoord): SphericalCoord {
        var radius = this.GetModuloFromCartesianCoord(coord);
        var theta = this.GetThetaFromCartesianCoord(coord);
        var phi = this.GetPhiFromCartesianCoord(coord);
        return new SphericalCoord(radius, theta, phi);
    }

    static GetModuloFromCartesianCoord(coord: CartesianCoord): number {
        return Math.sqrt(coord.x * coord.x + coord.y * coord.y + coord.z * coord.z);
    }

    static GetThetaFromCartesianCoord(coord: CartesianCoord): number {
        // return Math.atan(Math.sqrt(coord.x*coord.x + coord.y*coord.y)/coord.z);
        return Math.acos(coord.z / this.GetModuloFromCartesianCoord(coord));
    }

    static GetPhiFromCartesianCoord(coord: CartesianCoord): number {
        return Math.atan(coord.y / coord.x);
    }

    static SphericalToCartesian(coord: SphericalCoord): CartesianCoord {
        var x = this.GetXFromSphericalCoord(coord);
        var y = this.GetYFromSphericalCoord(coord);
        var z = this.GetZFromSphericalCoord(coord);
        return new CartesianCoord(x, y, z);
    }

    static GetXFromSphericalCoord(coord: SphericalCoord): number {
        return coord.radius * Math.sin(coord.theta) * Math.cos(coord.phi);
    }

    static GetYFromSphericalCoord(coord: SphericalCoord): number {
        return coord.radius * Math.sin(coord.theta) * Math.sin(coord.phi);
    }

    static GetZFromSphericalCoord(coord: SphericalCoord): number {
        return coord.radius * Math.cos(coord.theta);
    }
}
export {CartesianCoord,SphericalCoord,CoordsTransform};
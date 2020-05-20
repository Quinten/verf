import Body from './Body.js';

class World {

    constructor({
        gravityX = 0,
        gravityY = 0
    } = {}) {
        this.gravityX = gravityX;
        this.gravityY = gravityY;
        this.worldBoundsRestitution = 1;
        this.bodies = [];
        this.colliders = [];
    }

    addBody(body)
    {
        this.bodies.push(body);
    }

    removeBody(body)
    {
        let colliders = this.getCollidersOfBody(body);
        colliders.forEach((collider) => {
            this.removeCollider(collider);
        });
        this.bodies.splice(this.bodies.indexOf(body), 1);
    }

    getCollidersOfBody(body)
    {
        let colliders = [];
        this.colliders.forEach((collider) => {
            if (collider.a == body || collider.b == body) {
                colliders.push(collider);
            }
        });
        return colliders;
    }

    addCollider({
        a = undefined,
        b = undefined,
        callback = undefined
    } = {}){
        if (!a || !b || !a.body || !b.body) {
            return;
        }
        let collider = {a: a.body, b: b.body, callback: callback};
        this.colliders.push(collider);
        return collider;
    }

    removeCollider(collider)
    {
        this.colliders.splice(this.colliders.indexOf(collider), 1);
    }

    collideRect(a, b)
    {
        if (a.bottom < b.top || a.top > b.bottom || a.right < b.left || a.left > b.right) {
            return false;
        }

        return true;
    }

    seperateAFromB(a, b)
    {
        // To find the side of entry calculate based on
        // the normalized sides
        let dx = (b.midX - a.midX) / b.halfWidth;
        let dy = (b.midY - a.midY) / b.halfHeight;

        // Calculate the absolute change in x and y
        let absDX = Math.abs(dx);
        let absDY = Math.abs(dy);

        // If the distance between the normalized x and y
        // position is less than a small threshold (.1 in this case)
        // then this object is approaching from a corner
        if (Math.abs(absDX - absDY) < .1) {

            // If a is approaching from the right
            if (dx < 0) {
                a.x = b.right;

            // If a is approaching from the left
            } else {
                a.x = b.left - a.width;
            }

            // If a is approaching from the bottom
            if (dy < 0) {
                a.y = b.bottom;

            // If a is approaching from the top
            } else {
                a.y = b.top - a.height;
            }

            // Randomly select a x/y direction to reflect velocity on
            if (Math.random() < .5) {

                a.vx = -a.vx * b.restitution;

                // If the object's velocity is nearing 0, set it to 0
                // treshhold is set to .0004
                if (Math.abs(a.vx) < .0004) {
                    a.vx = 0;
                }

            } else {

                a.vy = -a.vy * b.restitution;
                if (Math.abs(a.vy) < .0004) {
                    a.vy = 0;
                }
            }

        // If a is approaching from the sides
        } else if (absDX > absDY) {

            // If a is approaching from the right
            if (dx < 0) {
                a.x = b.right;
            } else {
            // If a is approaching from the left
                a.x = b.left - a.width;
            }

            a.vx = -a.vx * b.restitution;

            if (Math.abs(a.vx) < .0004) {
                a.vx = 0;
            }

        // If this collision is coming from the top or bottom
        } else {

            // If a is approaching from the bottom
            if (dy < 0) {
                a.y = b.bottom;

            } else {
            // If a is approaching from the top
                a.y = b.top - a.height;
            }

            a.vy = -a.vy * b.restitution;

            if (Math.abs(a.vy) < .0004) {
                a.vy = 0;
            }
        }
    }

    seperateBoth(a, b)
    {
        // To find the side of entry calculate based on
        // the normalized sides
        let dx = (b.midX - a.midX) / b.halfWidth;
        let dy = (b.midY - a.midY) / b.halfHeight;

        // Calculate the absolute change in x and y
        let absDX = Math.abs(dx);
        let absDY = Math.abs(dy);

        // If the distance between the normalized x and y
        // position is less than a small threshold (.1 in this case)
        // then this object is approaching from a corner
        if (Math.abs(absDX - absDY) < .1) {

            // If a is approaching from the right
            if (dx < 0) {
                let overlap = (b.right - a.left) / 2;
                a.x += overlap;
                b.x -= overlap;

            // If a is approaching from the left
            } else {
                let overlap = (a.right - b.left) / 2;
                a.x -= overlap;
                b.x += overlap;
            }

            // If a is approaching from the bottom
            if (dy < 0) {
                let overlap = (b.bottom - a.top) / 2;
                a.y += overlap;
                b.y -= overlap;

            // If a is approaching from the top
            } else {
                let overlap = (a.bottom - b.top) / 2;
                a.y -= overlap;
                b.y += overlap;
            }

            // Randomly select a x/y direction to reflect velocity on
            if (Math.random() < .5) {
                a.vx = -a.vx * b.restitution;
                b.vx = -b.vx * a.restitution;
            } else {
                a.vy = -a.vy * b.restitution;
                b.vy = -b.vy * a.restitution;
            }

        // If a is approaching from the sides
        } else if (absDX > absDY) {

            // If a is approaching from the right
            if (dx < 0) {
                let overlap = (b.right - a.left) / 2;
                a.x += overlap;
                b.x -= overlap;
            } else {
            // If a is approaching from the left
                let overlap = (a.right - b.left) / 2;
                a.x -= overlap;
                b.x += overlap;
            }

            a.vx = -a.vx * b.restitution;
            b.vx = -b.vx * a.restitution;

        // If this collision is coming from the top or bottom
        } else {

            // If a is approaching from the bottom
            if (dy < 0) {
                let overlap = (b.bottom - a.top) / 2;
                a.y += overlap;
                b.y -= overlap;

            } else {
            // If a is approaching from the top
                let overlap = (a.bottom - b.top) / 2;
                a.y -= overlap;
                b.y += overlap;
            }

            a.vy = -a.vy * b.restitution;
            b.vy = -b.vy * a.restitution;
        }
    }

    step(delta)
    {
        delta = delta / 1000; // convert delta to seconds, so we can define velocity in pixels per second

        let gx = this.gravityX * delta;
        let gy = this.gravityY * delta;

        this.bodies.forEach((body) => {

            if (body.allowGravity) {
                body.vx += body.ax * delta + gx;
                body.vy += body.ay * delta + gy;
            } else {
                body.vx += body.ax * delta;
                body.vy += body.ay * delta;
            }

            body.x  += body.vx * delta;
            body.y  += body.vy * delta;
        });

        this.colliders.forEach((collider) => {
            if (this.collideRect(collider.a, collider.b)) {

                if (!collider.a.immovable && collider.b.immovable) {
                    this.seperateAFromB(collider.a, collider.b);
                } else if (collider.a.immovable && !collider.b.immovable) {
                    this.seperateAFromB(collider.b, collider.a);
                } else if (!collider.a.immovable && !collider.b.immovable) {
                    this.seperateBoth(collider.a, collider.b);
                }
                if (collider.callback) {
                    collider.callback(collider.a, collider.b);
                }
            }
        });

        if (this.bounds) {
            this.bodies.forEach((body) => {
                if (body.collideWorldBounds) {
                    if (body.left < this.bounds.x) {
                        body.x = this.bounds.x;
                        body.vx = -body.vx * this.worldBoundsRestitution;
                    }
                    if (body.top < this.bounds.y) {
                        body.y = this.bounds.y;
                        body.vy = -body.vy * this.worldBoundsRestitution;
                    }
                    if (body.right > this.bounds.x + this.bounds.width) {
                        body.x = this.bounds.x + this.bounds.width - body.width;
                        body.vx = -body.vx * this.worldBoundsRestitution;
                    }
                    if (body.bottom > this.bounds.y + this.bounds.height) {
                        body.y = this.bounds.y + this.bounds.height - body.height;
                        body.vy = -body.vy * this.worldBoundsRestitution;
                    }
                }
            });
        }
    }

    setBounds(x, y, width, height)
    {
        this.bounds = {x, y, width, height};
    }

    destroy()
    {
        this.bodies = [];
        this.colliders = [];
    }
}
export default World;

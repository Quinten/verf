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
        callback = undefined,
        seperate = true
    } = {}){
        if (!a || !b || !a.body || !b.body) {
            return;
        }
        let collider = {a: a.body, b: b.body, callback: callback, seperate: seperate};
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

    seperateAFromB(a, b, delta)
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
                a.blocked.left = true;

            // If a is approaching from the left
            } else {
                a.x = b.left - a.width;
                a.blocked.right = true;
            }

            // If a is approaching from the bottom
            if (dy < 0) {
                a.y = b.bottom;
                a.blocked.top = true;

            // If a is approaching from the top
            } else {
                a.y = b.top - a.height;
                a.blocked.bottom = true;
            }

            // Randomly select a x/y direction to reflect velocity on
            if (Math.random() < .5) {

                a.vx = -a.vx * b.restitution;

                // If the object's velocity is nearing 0, set it to 0
                // treshhold is set to .0004
                if (Math.abs(a.vx) < .0004) {
                    a.vx = 0;
                }

                a.x += b.vx * b.frictionX * delta;

            } else {

                a.vy = -a.vy * b.restitution;
                if (Math.abs(a.vy) < .0004) {
                    a.vy = 0;
                }

                a.y += b.vy * b.frictionY * delta;
            }

        // If a is approaching from the sides
        } else if (absDX > absDY) {

            // If a is approaching from the right
            if (dx < 0) {
                a.x = b.right;
                a.blocked.left = true;
            } else {
            // If a is approaching from the left
                a.x = b.left - a.width;
                a.blocked.right = true;
            }

            a.vx = -a.vx * b.restitution;
            a.x += b.vx * b.frictionX * delta;

            if (Math.abs(a.vx) < .0004) {
                a.vx = 0;
            }

        // If this collision is coming from the top or bottom
        } else {

            // If a is approaching from the bottom
            if (dy < 0) {
                a.y = b.bottom;
                a.blocked.top = true;
            } else {
            // If a is approaching from the top
                a.y = b.top - a.height;
                a.blocked.bottom = true;
            }

            a.vy = -a.vy * b.restitution;
            a.y += b.vy * b.frictionY * delta;

            if (Math.abs(a.vy) < .0004) {
                a.vy = 0;
            }
        }

        a.blocked.none = false;
    }

    seperateBoth(a, b, delta)
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

                a.touching.left = true;
                b.touching.right = true;

            // If a is approaching from the left
            } else {
                let overlap = (a.right - b.left) / 2;
                a.x -= overlap;
                b.x += overlap;

                a.touching.right = true;
                b.touching.left = true;
            }

            // If a is approaching from the bottom
            if (dy < 0) {
                let overlap = (b.bottom - a.top) / 2;
                a.y += overlap;
                b.y -= overlap;

                a.touching.top = true;
                b.touching.bottom = true;

            // If a is approaching from the top
            } else {
                let overlap = (a.bottom - b.top) / 2;
                a.y -= overlap;
                b.y += overlap;

                a.touching.bottom = true;
                b.touching.top = true;
            }

        // If a is approaching from the sides
        } else if (absDX > absDY) {

            // If a is approaching from the right
            if (dx < 0) {
                let overlap = (b.right - a.left) / 2;
                a.x += overlap;
                b.x -= overlap;

                a.touching.left = true;
                b.touching.right = true;

                if (this.gravityX > 0) {
                    b.vy = 0;
                    b.y += a.vy * a.frictionY * delta;
                } else if (this.gravityX < 0) {
                    a.vy = 0;
                    a.y += b.vy * b.frictionY * delta;
                }
            } else {
            // If a is approaching from the left
                let overlap = (a.right - b.left) / 2;
                a.x -= overlap;
                b.x += overlap;

                a.touching.right = true;
                b.touching.left = true;

                if (this.gravityX > 0) {
                    a.vy = 0;
                    a.y += b.vy * b.frictionY * delta;
                } else if (this.gravityX < 0) {
                    b.vy = 0;
                    b.y += a.vy * a.frictionY * delta;
                }
            }

        // If this collision is coming from the top or bottom
        } else {

            // If a is approaching from the bottom
            if (dy < 0) {
                let overlap = (b.bottom - a.top) / 2;
                a.y += overlap;
                b.y -= overlap;

                a.touching.top = true;
                b.touching.bottom = true;

                if (this.gravityY > 0) {
                    b.vy = 0;
                    b.x += a.vx * a.frictionX * delta;
                } else if (this.gravityY < 0) {
                    a.vy = 0;
                    a.x += b.vx * b.frictionX * delta;
                }

            } else {
            // If a is approaching from the top
                let overlap = (a.bottom - b.top) / 2;
                a.y -= overlap;
                b.y += overlap;

                a.touching.bottom = true;
                b.touching.top = true;

                if (this.gravityY > 0) {
                    a.vy = 0;
                    a.x += b.vx * b.frictionX * delta;
                } else if (this.gravityY < 0) {
                    b.vy = 0;
                    b.x += a.vx * a.frictionX * delta;
                }
            }
        }
    }

    step(delta)
    {
        delta = delta / 1000; // convert delta to seconds, so we can define velocity in pixels per second

        let gx = this.gravityX * delta;
        let gy = this.gravityY * delta;

        this.bodies.forEach((body) => {

            if (body.allowGravity) {
                body.vx += gx;
                body.vy += gy;
            }

            body.x += body.vx * delta;
            body.y += body.vy * delta;

            // reset collision flags
            body.blocked.none = true;
            body.blocked.top = false;
            body.blocked.right = false;
            body.blocked.bottom = false;
            body.blocked.left = false;

            body.touching.none = true;
            body.touching.top = false;
            body.touching.right = false;
            body.touching.bottom = false;
            body.touching.left = false;
        });

        this.colliders.forEach((collider) => {
            if (this.collideRect(collider.a, collider.b)) {

                if (collider.seperate) {
                    if (!collider.a.immovable && collider.b.immovable) {
                        this.seperateAFromB(collider.a, collider.b, delta);
                    } else if (collider.a.immovable && !collider.b.immovable) {
                        this.seperateAFromB(collider.b, collider.a, delta);
                    } else if (!collider.a.immovable && !collider.b.immovable) {
                        this.seperateBoth(collider.a, collider.b, delta);
                    }
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
                        body.blocked.left = true;
                    }
                    if (body.top < this.bounds.y) {
                        body.y = this.bounds.y;
                        body.vy = -body.vy * this.worldBoundsRestitution;
                        body.blocked.top = true;
                    }
                    if (body.right > this.bounds.x + this.bounds.width) {
                        body.x = this.bounds.x + this.bounds.width - body.width;
                        body.vx = -body.vx * this.worldBoundsRestitution;
                        body.blocked.right = true;
                    }
                    if (body.bottom > this.bounds.y + this.bounds.height) {
                        body.y = this.bounds.y + this.bounds.height - body.height;
                        body.vy = -body.vy * this.worldBoundsRestitution;
                        body.blocked.bottom = true;
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

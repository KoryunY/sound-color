import { Injectable } from '@nestjs/common';

@Injectable()
export class ColorrocessingService {
    getGradientRgbArray(rgbColor1, rgbColor2, count) {
        let stepR = (rgbColor2.r - rgbColor1.r) / (count - 1);
        let stepG = (rgbColor2.g - rgbColor1.g) / (count - 1);
        let stepB = (rgbColor2.b - rgbColor1.b) / (count - 1);
        let gradient = [];

        for (let i = 0; i < count; i++) {
            let r = Math.round(rgbColor1.r + stepR * i);
            let g = Math.round(rgbColor1.g + stepG * i);
            let b = Math.round(rgbColor1.b + stepB * i);
            gradient.push([r, g, b]);
        }

        return gradient;
    }

    hslToRgb(h, s, l) {
        // Convert HSL color values to RGB color values
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    rgbToHex(rgb) {
        // Convert the red, green, and blue values to hex strings
        const rHex = rgb[0].toString(16).padStart(2, '0');
        const gHex = rgb[1].toString(16).padStart(2, '0');
        const bHex = rgb[2].toString(16).padStart(2, '0');
        // Combine the hex strings and return the result
        return `#${rHex}${gHex}${bHex}`;
    }

    hexToRgb(hex) {
        // Convert hex string to integer value
        const intVal = parseInt(hex.substring(1), 16);

        // Extract red, green, and blue values using bit-shifting and bitwise AND operations
        const r = (intVal >> 16) & 255;
        const g = (intVal >> 8) & 255;
        const b = intVal & 255;

        // Return an object with r, g, and b properties
        return [r, g, b];
    }

    getColorFamily(color, count) {
        // Parse the input color from hex to RGB format
        const r = parseInt(color.substring(1, 3), 16);
        const g = parseInt(color.substring(3, 5), 16);
        const b = parseInt(color.substring(5, 7), 16);
        // Define a function to interpolate between two colors
        function interpolateColor(color1, color2, factor) {
            const r1 = parseInt(color1.substring(1, 3), 16);
            const g1 = parseInt(color1.substring(3, 5), 16);
            const b1 = parseInt(color1.substring(5, 7), 16);
            const r2 = parseInt(color2.substring(1, 3), 16);
            const g2 = parseInt(color2.substring(3, 5), 16);
            const b2 = parseInt(color2.substring(5, 7), 16);
            const r = Math.round(r1 + factor * (r2 - r1));
            const g = Math.round(g1 + factor * (g2 - g1));
            const b = Math.round(b1 + factor * (b2 - b1));
            return "#" + r.toString(16).padStart(2, "0") +
                g.toString(16).padStart(2, "0") +
                b.toString(16).padStart(2, "0");
        }
        // Define the parent colors as slightly darker versions of the input color
        const parents = [];
        for (let i = 0; i < count / 2; i++) {
            const factor = (i + 1) / (count / 2 + 1);
            const parent = interpolateColor("#000000", color, factor);
            parents.push(parent);
        }
        // Define the child colors as slightly lighter versions of the input color
        const children = [];
        for (let i = 0; i < count / 2; i++) {
            const factor = (i + 1) / (count / 2 + 1);
            const child = interpolateColor(color, "#ffffff", factor);
            children.push(child);
        }
        // Return the combined array of parent and child colors
        return parents.concat(children);
    }

    combineColors(colors) {
        const totalColors = colors.length;
        let rTotal = 0;
        let gTotal = 0;
        let bTotal = 0;

        // Convert each color to RGB values and add them up
        colors.forEach(color => {
            if (color.length > 0) {
                const r = parseInt(color.substring(1, 3), 16);
                const g = parseInt(color.substring(3, 5), 16);
                const b = parseInt(color.substring(5, 7), 16);
                rTotal += r;
                gTotal += g;
                bTotal += b;
            }
        });

        // Calculate the average RGB values
        const avgR = Math.round(rTotal / totalColors);
        const avgG = Math.round(gTotal / totalColors);
        const avgB = Math.round(bTotal / totalColors);

        // Convert the average RGB values back to hexadecimal format
        const combinedColor = "#" + this.componentToHex(avgR) + this.componentToHex(avgG) + this.componentToHex(avgB);
        return combinedColor;
    }

    componentToHex(c) {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
}
import { calcTileType } from '../utils';

test('index == 0', () => {
    const received = calcTileType(0, 63);
    const expected = 'top-left';

    expect(received).toBe(expected);
});

test('index > 0 && index < 7', () => {
    const received = calcTileType(5, 63);
    const expected = 'top';

    expect(received).toBe(expected);
});

test('index == 7', () => {
    const received = calcTileType(7, 63);
    const expected = 'top-right';

    expect(received).toBe(expected);
});

test('index == 8', () => {
    const received = calcTileType(8, 63);
    const expected = 'left';

    expect(received).toBe(expected);
});

test('index == 16', () => {
    const received = calcTileType(16, 63);
    const expected = 'left';

    expect(received).toBe(expected);
});

test('index == 24', () => {
    const received = calcTileType(24, 63);
    const expected = 'left';

    expect(received).toBe(expected);
});

test('index == 32', () => {
    const received = calcTileType(32, 63);
    const expected = 'left';

    expect(received).toBe(expected);
});

test('index == 40', () => {
    const received = calcTileType(40, 63);
    const expected = 'left';

    expect(received).toBe(expected);
});

test('index == 48', () => {
    const received = calcTileType(48, 63);
    const expected = 'left';

    expect(received).toBe(expected);
});

test('index == 15', () => {
    const received = calcTileType(15, 63);
    const expected = 'right';

    expect(received).toBe(expected);
});

test('index == 23', () => {
    const received = calcTileType(23, 63);
    const expected = 'right';

    expect(received).toBe(expected);
});

test('index == 31', () => {
    const received = calcTileType(31, 63);
    const expected = 'right';

    expect(received).toBe(expected);
});

test('index == 39', () => {
    const received = calcTileType(39, 63);
    const expected = 'right';

    expect(received).toBe(expected);
});

test('index == 47', () => {
    const received = calcTileType(47, 63);
    const expected = 'right';

    expect(received).toBe(expected);
});

test('index == 55', () => {
    const received = calcTileType(55, 63);
    const expected = 'right';

    expect(received).toBe(expected);
});

test('index == 56', () => {
    const received = calcTileType(56, 63);
    const expected = 'bottom-left';

    expect(received).toBe(expected);
});

test('index > 56 && index < 63', () => {
    const received = calcTileType(60, 63);
    const expected = 'bottom';

    expect(received).toBe(expected);
});

test('index == 63', () => {
    const received = calcTileType(63, 63);
    const expected = 'bottom-right';

    expect(received).toBe(expected);
});

test('center', () => {
    const received = calcTileType(13, 63);
    const expected = 'center';

    expect(received).toBe(expected);
});

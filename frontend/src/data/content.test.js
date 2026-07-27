import test from 'node:test';
import assert from 'node:assert/strict';
import { doctors, hospitals } from './content.js';

test('doctor catalog includes 50 doctors for each requested city', () => {
  const counts = doctors.reduce((result, doctor) => {
    result[doctor.city] = (result[doctor.city] || 0) + 1;
    return result;
  }, {});

  assert.deepEqual(counts, {
    Nagpur: 50,
    Bengaluru: 50,
    Mumbai: 50,
    Hyderabad: 50,
  });
});

test('doctor records include designation and specialty metadata', () => {
  const sample = doctors[0];

  assert.ok(sample.designation);
  assert.ok(sample.specialty);
  assert.ok(sample.city);
});

test('hospital records include map metadata', () => {
  hospitals.forEach((hospital) => {
    assert.ok(hospital.address);
    assert.ok(hospital.phone);
    assert.ok(hospital.distance);
    assert.equal(typeof hospital.coordinates.lat, 'number');
    assert.equal(typeof hospital.coordinates.lng, 'number');
  });
});

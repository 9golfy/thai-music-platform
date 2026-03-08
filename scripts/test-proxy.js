// Test the proxy functionality
const testData = {
  regsup_schoolName: 'Test School',
  regsup_schoolProvince: 'Bangkok',
  total_score: 85,
  teacher_training_score: 20
};

// Create the same proxy as in the component
const createFieldProxy = (data) => {
  if (!data) return null;
  
  return new Proxy(data, {
    get(target, prop) {
      if (typeof prop === 'string') {
        // First try with regsup_ prefix, then without prefix
        return target[`regsup_${prop}`] ?? target[prop];
      }
      return target[prop];
    }
  });
};

const proxy = createFieldProxy(testData);

console.log('Original data:', testData);
console.log('Proxy schoolName:', proxy.schoolName);
console.log('Proxy schoolProvince:', proxy.schoolProvince);
console.log('Proxy total_score:', proxy.total_score);
console.log('Proxy teacher_training_score:', proxy.teacher_training_score);
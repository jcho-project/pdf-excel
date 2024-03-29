let testSubject = [1, 2, 3, 4, 5];

function promiseTest(input) {
  return new Promise((resolve, reject) => {
    const group = [];

    for (let i = 0; i < input.length; i++) {
      group.push(input[i] * 2);
    }

    resolve(group);
  })
}

async function addData(input) {
  const addition = await promiseTest(input);

  addition.push(1000);

  return addition;
}

// console.log("Promise : ", promiseTest(testSubject));
// console.log("Async : ", addData(testSubject));

// promiseTest(testSubject).then(result => console.log("Resolved Promise : ", result));
// addData(testSubject).then(result => console.log("Resolved Async : ", result));

async function consolidate() {
  const newArray = [];

  // const group = await addData(testSubject);

  // // const newArray = group.map(item => item / 2);

  // for (let i = 0; i < group.length; i++) {
  //   newArray.push(group[i] / 2);
  // }

  // return newArray;

  newArray.push(promiseTest(testSubject));
  newArray.push(addData(testSubject));

  console.log(newArray)

  return Promise.all(newArray);
}

// addData(testSubject).then(x => console.log(x));
// consolidate().then(console.log);
// console.log(consolidate());
consolidate()


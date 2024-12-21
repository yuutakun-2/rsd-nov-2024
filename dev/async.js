function a() {
    console.log("Function A");
}

function b(shouldReject) {
	return new Promise((resolve, reject) => {
        setTimeout(() => {
			if (shouldReject) {
				reject("Function B Rejected");
			} else {
				resolve("Function B");
			}
		}, 2000);
    });
}

function c() {
	console.log("Function C");
}

async function app() {
    a();
    try {
        console.log(await b(false)); // Change parameter to true to test rejection
    } catch (error) {
        console.error(error);
    }
    c();
}

app();

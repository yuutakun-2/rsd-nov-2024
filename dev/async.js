function a() {
    console.log("Function A");
}

function b() {
	return new Promise((resolve, reject) => {
        setTimeout(() => {
			resolve("Function B");
		}, 2000);
    });
}

function c() {
	console.log("Function C");
}

async function app() {
    a();
    console.log(await b());
    c();
}

app();

import axios from 'axios';

const BASE_URL = 'http://98.93.255.158:8080';

async function testEndpoints() {
    try {
        console.log("Testing getCourseModules...");
        // Use an example courseId from the instructor API test earlier
        const res = await axios.get(`${BASE_URL}/api/instructor/modules/course/digital-marketing?page=0&size=50`);
        const data = res.data?.data?.content || res.data?.content || res.data?.data || res.data;
        if (Array.isArray(data) && data.length > 0) {
            console.log("Module keys:", Object.keys(data[0]));
            console.log("First Module:", JSON.stringify(data[0], null, 2));
        } else {
            console.log("No modules found or not an array:", data);
        }
    } catch (e) {
        console.error("Failed:", e.response ? e.response.status : e.message);
    }
}

testEndpoints();

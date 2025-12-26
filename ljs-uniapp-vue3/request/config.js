/**
 * 配置：API访问地址
 * */
const technical_support = '龙九山'; // 技术支持
const projectName = 'LJS-UNIAPP-框架'; // 项目名称
const email = '38839364@qq.com'; // 邮箱

// 本地
const service_development = {
	base_url: 'http://localhost:8080', // 接口地址
	timeout: 30000,
	technical_support,
	projectName,
	email,
}

// 测试
const service_test = {
	base_url: 'https://www.ljs.test.com', // 接口地址
	timeout: 30000,
	technical_support,
	projectName,
	email,
}

// 生产
const service_production = {
	base_url: 'https://www.ljs.com', // 接口地址
	timeout: 30000,
	technical_support,
	projectName,
	email,
}


export default service_development // 本地
// export default service_test // 测试
// export default service_production // 生产
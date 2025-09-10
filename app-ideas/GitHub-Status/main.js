// 创建 Vue 应用
const { createApp } = Vue;

const githubStatusApp = createApp({
  data() {
    return {
      components: []
    }
  },
  mounted() {
    console.log("页面加载完成！");
    this.loadGithubStatus();
  },
  methods: {
    async loadGithubStatus() {
      try {
        const data = await fetchGithubStatus();
        this.components = data.components;
        console.log("Components loaded:", this.components);
      } catch (error) {
        console.error("Error fetching GitHub status:", error);
      }
    }
  }
});

// 挂载 Vue 应用
githubStatusApp.mount('.repo-list');

// fetch github status
async function fetchGithubStatus() {
  try {
    const response = await fetch(
      "https://www.githubstatus.com/api/v2/summary.json"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ` + response.status);
    }

    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error fetching GitHub status:", error);
    throw error;
  }
}

// GitHub API integration for portfolio projects
document.addEventListener('DOMContentLoaded', async function() {
  const projectsContainer = document.getElementById('projects-grid');
  
  if (!projectsContainer) return;
  
  try {
    // Show loading state
    projectsContainer.innerHTML = '<div class="col-span-2 text-center py-12 text-slate-500">Loading projects...</div>';
    
    // Fetch repositories from GitHub API
    const response = await fetch('https://api.github.com/users/RGANS087/repos?sort=updated&per_page=6&visibility=public');
    
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }
    
    const repos = await response.json();
    
    // Filter out forks and sort by stars/stargazers
    const filteredRepos = repos.filter(repo => !repo.fork).sort((a, b) => b.stargazers_count - a.stargazers_count);
    
    // Generate project cards
    projectsContainer.innerHTML = filteredRepos.map((repo, index) => {
      const tech = repo.language ? `<span class="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">${repo.language}</span>` : '';
      const description = repo.description ? `<p class="text-slate-600 mb-4">${repo.description}</p>` : '<p class="text-slate-600 mb-4 italic">No description provided</p>';
      const delay = index * 100;
      
      return `
        <div class="bg-slate-50 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300" data-aos="flip-up" data-aos-duration="800" data-aos-delay="${delay}">
          <div class="aspect-video relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <i class="fab fa-github text-6xl text-slate-400"></i>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2 text-slate-800">${repo.name.replace(/-/g, ' ')}</h3>
            ${description}
            ${tech}
            <div class="flex gap-4 mt-4">
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" 
                 class="text-slate-700 hover:text-slate-900 font-medium transition-colors">
                GitHub →
              </a>
              ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" 
                 class="text-amber-600 hover:text-amber-700 font-medium transition-colors">
                Live Demo →
              </a>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    // Refresh AOS after loading new content
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
    
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    projectsContainer.innerHTML = '<div class="col-span-2 text-center py-12 text-red-500">Failed to load projects. Please try again later.</div>';
  }
});
// GitHub API integration for portfolio projects
// Menampilkan repo publik RGANS087 sebagai kartu proyek (dark theme).
// Jika API gagal / rate-limited, dipakai data cadangan statis.

const FALLBACK_PROJECTS = [
	{
		name: 'portofolio',
		description: 'Website portofolio pribadi yang dibangun dengan Astro & Tailwind CSS.',
		language: 'Astro',
		stars: 1,
		html_url: 'https://github.com/RGANS087/portofolio',
		homepage: 'https://portofolio-livid-eta-98.vercel.app',
	},
	{
		name: 'E-PERPUS',
		description: 'Website perpustakaan digital yang dibuat untuk penilaian UKK.',
		language: 'CSS',
		stars: 0,
		html_url: 'https://github.com/RGANS087/E-PERPUS',
		homepage: null,
	},
	{
		name: 'asgo',
		description: 'Eksperimen Astro dikombinasikan dengan Golang.',
		language: 'Astro',
		stars: 0,
		html_url: 'https://github.com/RGANS087/asgo',
		homepage: null,
	},
	{
		name: 'nextbot',
		description: 'Bot Telegram yang ditulis dengan TypeScript.',
		language: 'TypeScript',
		stars: 0,
		html_url: 'https://github.com/RGANS087/nextbot',
		homepage: null,
	},
	{
		name: 'frameweb',
		description: 'Framework web latihan berbasis PHP.',
		language: 'PHP',
		stars: 0,
		html_url: 'https://github.com/RGANS087/frameweb',
		homepage: null,
	},
	{
		name: 'newRJS',
		description: 'Repositori latihan JavaScript.',
		language: 'JavaScript',
		stars: 0,
		html_url: 'https://github.com/RGANS087/newRJS',
		homepage: null,
	},
];

const LANGUAGE_COLORS = {
	HTML: '#e34c26',
	CSS: '#563d7c',
	JavaScript: '#f1e05a',
	TypeScript: '#3178c6',
	PHP: '#4F5D95',
	Astro: '#ff5d01',
	Java: '#b07219',
};

function esc(str) {
	return String(str ?? '').replace(/[&<>"']/g, (c) => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
	}[c]));
}

function renderCard(repo, index) {
	const langColor = LANGUAGE_COLORS[repo.language] || '#64748b';
	const techBadge = repo.language
		? `<span class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
				 <span class="h-2 w-2 rounded-full" style="background:${langColor}"></span>
				 ${esc(repo.language)}
			 </span>`
		: '';

	const description = repo.description
		? esc(repo.description)
		: '<span class="italic text-slate-500">Tanpa deskripsi</span>';

	const demoLink = repo.homepage
		? `<a href="${esc(repo.homepage)}" target="_blank" rel="noopener noreferrer"
					class="inline-flex items-center gap-1 text-sm font-medium text-amber-400 transition hover:text-amber-300">
					Live Demo <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
			 </a>`
		: '';

	return `
		<div data-aos="flip-up" data-aos-duration="700" data-aos-delay="${index * 80}">
			<a href="${esc(repo.html_url)}" target="_blank" rel="noopener noreferrer"
				 class="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-night-800/60 backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-amber-400/30 hover:shadow-2xl hover:shadow-amber-500/10">
				<div class="flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-night-950 via-night-900 to-night-800">
					<i class="fa-brands fa-github text-6xl text-white/10 transition duration-500 group-hover:scale-110 group-hover:text-amber-400/20"></i>
				</div>
				<div class="flex flex-1 flex-col p-6">
					<div class="flex items-start justify-between gap-3">
						<h3 class="min-w-0 flex-1 break-words font-display text-base font-semibold capitalize text-white transition group-hover:text-amber-400">${esc(repo.name.replace(/-/g, ' '))}</h3>
						${techBadge}
					</div>
					<p class="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-400">${description}</p>
					<div class="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
						<span class="inline-flex items-center gap-1.5 text-xs text-slate-500">
							<i class="fa-regular fa-star"></i> ${repo.stargazers_count ?? repo.stars ?? 0}
						</span>
						<span class="inline-flex items-center gap-1 text-sm font-medium text-slate-300 transition group-hover:text-white">
							Lihat Repo <i class="fa-solid fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1"></i>
						</span>
					</div>
					${demoLink ? `<div class="mt-3">${demoLink}</div>` : ''}
				</div>
			</a>
		</div>`;
}

document.addEventListener('DOMContentLoaded', async function () {
	const container = document.getElementById('projects-grid');
	if (!container) return;

	try {
		const response = await fetch('https://api.github.com/users/RGANS087/repos?sort=updated&per_page=9&visibility=public');

		if (!response.ok) throw new Error('GitHub API: ' + response.status);

		const repos = await response.json();
		const filtered = repos.filter((repo) => !repo.fork && repo.name !== 'portofolio');
		const sorted = [...filtered].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);

		container.innerHTML = sorted.map(renderCard).join('');
	} catch (error) {
		console.warn('Gagal memuat repo dari GitHub API, memakai data cadangan:', error);
		container.innerHTML = FALLBACK_PROJECTS.map(renderCard).join('');
	}

	if (typeof AOS !== 'undefined') AOS.refresh();
});

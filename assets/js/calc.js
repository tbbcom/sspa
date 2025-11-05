// SSPA Calculation Logic
const sspaRates = {
	pelaksana: {
		phase1: 8,
		phase2: 7
	},
	pengurusan: {
		phase1: 8,
		phase2: 7
	},
	tertinggi: {
		phase1: 4,
		phase2: 3
	}
};
let calculationData = {};
document.getElementById('sspaCalcForm').addEventListener('submit', function(e) {
	e.preventDefault();
	calculateSSPA();
});

function calculateSSPA() {
	const gajiHakiki = parseFloat(document.getElementById('sspaGajiHakiki').value);
	const kumpulan = document.getElementById('sspaKumpulan').value;
	const gred = document.getElementById('sspaGred').value;
	if(!gajiHakiki || !kumpulan || !gred) {
		alert('Sila isi semua maklumat yang diperlukan');
		return;
	}
	const rates = sspaRates[kumpulan];
	// Phase 1 calculation
	const phase1Increase = gajiHakiki * (rates.phase1 / 100);
	const phase1Salary = gajiHakiki + phase1Increase;
	// Phase 2 calculation (based on Phase 1 salary)
	const phase2Increase = phase1Salary * (rates.phase2 / 100);
	const phase2Salary = phase1Salary + phase2Increase;
	// Total increase
	const totalIncrease = phase2Salary - gajiHakiki;
	const totalPercent = ((totalIncrease / gajiHakiki) * 100).toFixed(2);
	// Store calculation data
	calculationData = {
		gajiHakiki,
		kumpulan,
		gred,
		phase1Salary,
		phase2Salary,
		phase1Increase,
		phase2Increase,
		totalIncrease,
		totalPercent,
		rates
	};
	displayResults();
}

function displayResults() {
	const {
		gajiHakiki,
		kumpulan,
		gred,
		phase1Salary,
		phase2Salary,
		phase1Increase,
		phase2Increase,
		totalIncrease,
		totalPercent,
		rates
	} = calculationData;
	// Display current salary
	document.getElementById('sspaCurrentSalary').textContent = formatCurrency(gajiHakiki);
	// Display Phase 1
	document.getElementById('sspaPhase1Salary').textContent = formatCurrency(phase1Salary);
	document.getElementById('sspaPhase1Percent').textContent = `+${rates.phase1}%`;
	document.getElementById('sspaPhase1Increase').textContent = `+${formatCurrency(phase1Increase)}`;
	// Display Phase 2
	document.getElementById('sspaPhase2Salary').textContent = formatCurrency(phase2Salary);
	document.getElementById('sspaPhase2Percent').textContent = `+${rates.phase2}%`;
	document.getElementById('sspaPhase2Increase').textContent = `+${formatCurrency(phase2Increase)}`;
	// Display total
	document.getElementById('sspaTotalIncrease').textContent = `+${formatCurrency(totalIncrease)}`;
	document.getElementById('sspaTotalPercent').textContent = `(+${totalPercent}%)`;
	// Animate progress bars
	setTimeout(() => {
		document.getElementById('sspaPhase1Bar').style.width = `${Math.min(rates.phase1 * 10, 100)}%`;
		document.getElementById('sspaPhase1Bar').textContent = `+${rates.phase1}%`;
		document.getElementById('sspaPhase2Bar').style.width = `${Math.min(rates.phase2 * 10, 100)}%`;
		document.getElementById('sspaPhase2Bar').textContent = `+${rates.phase2}%`;
	}, 100);
	// Display formula
	const kumpulanName = getKumpulanName(kumpulan);
	document.getElementById('sspaFormula').innerHTML = `
                <strong>Kumpulan:</strong> ${kumpulanName}<br>
                <strong>Gred:</strong> ${gred}<br><br>
                <strong>Fasa 1:</strong> RM${gajiHakiki.toFixed(2)} × ${rates.phase1}% = RM${phase1Increase.toFixed(2)}<br>
                <strong>Gaji Fasa 1:</strong> RM${gajiHakiki.toFixed(2)} + RM${phase1Increase.toFixed(2)} = RM${phase1Salary.toFixed(2)}<br><br>
                <strong>Fasa 2:</strong> RM${phase1Salary.toFixed(2)} × ${rates.phase2}% = RM${phase2Increase.toFixed(2)}<br>
                <strong>Gaji Fasa 2:</strong> RM${phase1Salary.toFixed(2)} + RM${phase2Increase.toFixed(2)} = RM${phase2Salary.toFixed(2)}
            `;
	// Show results
	const resultsDiv = document.getElementById('sspaResults');
	resultsDiv.classList.add('sspa-calc-show');
	resultsDiv.scrollIntoView({
		behavior: 'smooth',
		block: 'nearest'
	});
}

function formatCurrency(amount) {
	return 'RM ' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function getKumpulanName(kumpulan) {
	const names = {
		'pelaksana': 'Kumpulan Pelaksana',
		'pengurusan': 'Kumpulan Pengurusan dan Profesional',
		'tertinggi': 'Kumpulan Pengurusan Tertinggi'
	};
	return names[kumpulan] || kumpulan;
}

function isCalculationReady() {
        return calculationData && typeof calculationData.gajiHakiki === 'number' && !Number.isNaN(calculationData.gajiHakiki);
}

function requireCalculationData(actionDescription) {
        if (isCalculationReady()) {
                return true;
        }

        const message = actionDescription ? `Sila buat pengiraan sebelum ${actionDescription}.` : 'Sila buat pengiraan terlebih dahulu.';
        alert(message);
        return false;
}

function sspaShareWhatsApp() {
        if (!requireCalculationData('berkongsi keputusan')) {
                return;
        }

        const {
                gajiHakiki, gred, phase1Salary, phase2Salary, totalIncrease, totalPercent
        } = calculationData;
        const message = ` Kalkulator SSPA 2025\n\n` + `Gaji Semasa: ${formatCurrency(gajiHakiki)}\n` + `Gred: ${gred}\n\n` + `✅ Fasa 1 (1 Dis 2024): ${formatCurrency(phase1Salary)}\n` + `✅ Fasa 2 (1 Jan 2026): ${formatCurrency(phase2Salary)}\n\n` + ` Jumlah Kenaikan: ${formatCurrency(totalIncrease)} (+${totalPercent}%)\n\n` + `Kira gaji anda di: ${window.location.href}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
}

function sspaCopyResult() {
        if (!requireCalculationData('menyalin keputusan')) {
                return;
        }

        const {
                gajiHakiki, gred, phase1Salary, phase2Salary, totalIncrease, totalPercent
        } = calculationData;
        const text = `Kalkulator SSPA 2025\n\n` + `Gaji Semasa: ${formatCurrency(gajiHakiki)}\n` + `Gred: ${gred}\n\n` + `Fasa 1 (1 Dis 2024): ${formatCurrency(phase1Salary)}\n` + `Fasa 2 (1 Jan 2026): ${formatCurrency(phase2Salary)}\n\n` + `Jumlah Kenaikan: ${formatCurrency(totalIncrease)} (+${totalPercent}%)`;
        copyTextToClipboard(text).then(() => {
                alert('✅ Keputusan berjaya disalin!');
        }).catch(() => {
                alert('Maaf, gagal menyalin keputusan. Sila cuba secara manual.');
        });
}

function sspaPrintResult() {
        if (!requireCalculationData('mencetak keputusan')) {
                return;
        }

        window.print();
}

function copyTextToClipboard(text) {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                return navigator.clipboard.writeText(text);
        }

        return new Promise((resolve, reject) => {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);

                const selection = document.getSelection();
                const selectedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

                textarea.select();

                try {
                        const successful = document.execCommand('copy');
                        if (!successful) {
                                reject();
                                return;
                        }
                        resolve();
                } catch (err) {
                        reject(err);
                } finally {
                        document.body.removeChild(textarea);
                        if (selectedRange && selection) {
                                selection.removeAllRanges();
                                selection.addRange(selectedRange);
                        }
                }
        });
}

function attachActionHandlers() {
        const actionMap = [
                { selectors: ['sspaShareButton', 'sspaShareWhatsApp', '[data-sspa-action="share"]'], handler: sspaShareWhatsApp },
                { selectors: ['sspaCopyButton', 'sspaCopyResult', '[data-sspa-action="copy"]'], handler: sspaCopyResult },
                { selectors: ['sspaPrintButton', 'sspaPrintResult', '[data-sspa-action="print"]'], handler: sspaPrintResult }
        ];

        actionMap.forEach(({ selectors, handler }) => {
                selectors.forEach((selector) => {
                        if (!selector) {
                                return;
                        }

                        let elements = [];
                        if (selector.startsWith('[')) {
                                elements = Array.from(document.querySelectorAll(selector));
                        } else {
                                const element = document.getElementById(selector);
                                if (element) {
                                        elements = [element];
                                }
                        }

                        elements.forEach((element) => {
                                if (!element.dataset || element.dataset.sspaHandlerAttached === 'true') {
                                        return;
                                }
                                element.addEventListener('click', handler);
                                element.dataset.sspaHandlerAttached = 'true';
                        });
                });
        });
}

if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachActionHandlers);
} else {
        attachActionHandlers();
}

if (typeof window !== 'undefined') {
        window.sspaShareWhatsApp = sspaShareWhatsApp;
        window.sspaCopyResult = sspaCopyResult;
        window.sspaPrintResult = sspaPrintResult;
}

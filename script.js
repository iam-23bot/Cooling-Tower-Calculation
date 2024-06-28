document.getElementById('coolingTowerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get input values
    const waterFlowRate = parseFloat(document.getElementById('waterFlowRate').value);
    const deltaT = parseFloat(document.getElementById('deltaT').value);
    const gphr = parseFloat(document.getElementById('gphr').value);
    const boilerEfficiency = parseFloat(document.getElementById('boilerEfficiency').value) / 100;
    const auxPower = parseFloat(document.getElementById('auxPower').value) / 100;
    const concentrationRatio = parseFloat(document.getElementById('concentrationRatio').value);
    const driftLossRate = parseFloat(document.getElementById('driftLossRate').value) / 100;

    // Check for valid input values
    if (isNaN(waterFlowRate) || isNaN(deltaT) || isNaN(gphr) || isNaN(boilerEfficiency) || isNaN(auxPower) || isNaN(concentrationRatio) || isNaN(driftLossRate)) {
        alert('Please enter valid numbers.');
        return;
    }

    // NPHR Calculation (in MMBTU/MWh)
    const nphr = gphr / (boilerEfficiency * (1 - auxPower));
    document.getElementById('nphrResult').textContent = `Net Plant Heat Rate (NPHR): ${nphr.toFixed(2)} MMBTU/MWh`;

    // Evaporation Loss Calculation
    const evaporationLoss = (0.00085 * waterFlowRate * deltaT).toFixed(2);
    document.getElementById('evaporationLossResult').textContent = `Evaporation Loss: ${evaporationLoss} GPM`;

    // Blowdown Calculation
    const blowdown = (evaporationLoss / (concentrationRatio - 1)).toFixed(2);
    document.getElementById('blowdownResult').textContent = `Blowdown: ${blowdown} GPM`;

    // Drift Loss Calculation
    const driftLoss = (driftLossRate * waterFlowRate).toFixed(2);
    document.getElementById('driftLossResult').textContent = `Drift Loss: ${driftLoss} GPM`;

    // Makeup Water Requirement Calculation
    const makeupWater = (parseFloat(evaporationLoss) + parseFloat(blowdown) + parseFloat(driftLoss)).toFixed(2);
    document.getElementById('makeupWaterResult').textContent = `Makeup Water Requirement: ${makeupWater} GPM`;

    // Chart.js to display efficiency chart
    const ctx = document.getElementById('efficiencyChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Evaporation Loss', 'Blowdown', 'Drift Loss', 'Makeup Water'],
            datasets: [{
                label: 'Losses and Requirements (GPM)',
                data: [evaporationLoss, blowdown, driftLoss, makeupWater],
                backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(54, 162, 235, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

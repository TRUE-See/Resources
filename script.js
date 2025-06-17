document.addEventListener('DOMContentLoaded', function() {
    // Sample data for the chart
    const dates = ['2025-02-25', '2025-03-05', '2025-03-20'];
    const values = [5.5, 6.0, 7.0];
    
    // Chart configuration
    const ctx = document.getElementById('woundChart').getContext('2d');
    const woundChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(date => {
                const d = new Date(date);
                return `${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}-${d.getFullYear()}`;
            }),
            datasets: [{
                label: 'Wound Measurement',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 2
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Value: ${context.parsed.y}`;
                        }
                    }
                }
            },
            onClick: (e) => {
                const points = woundChart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
                if (points.length) {
                    const firstPoint = points[0];
                    const index = firstPoint.index;
                    showDetailsInOffcanvas(index);
                }
            }
        }
    });
    
    // Data for the offcanvas details
    const detailsData = [
        {
            date: '03/20/2025',
            dateTime: '3/20/2025 10:26:30 AM',
            ref: 'ref #1919206',
            length: 'L: 1.95',
            width: 'W: 3.25',
            depth: 'D: 0.88',
            area: 'A: 1.95',
            volume: 'V: 3.25',
            volumeValue: '70.396',
            par: 'PAR: 17%',
            image: './images/true-photo-1.png',
            notes: 'Right Knee skin tear of unknown origin'
        },
        {
            date: '03/05/2025',
            dateTime: '3/5/2025 10:26:30 AM',
            ref: 'ref #10081929',
            length: 'L: 1.95',
            width: 'W: 3.25',
            depth: 'D: 0.88',
            area: 'A: 1.95',
            volume: 'V: 3.25',
            volumeValue: '63.396',
            par: 'PAR: 17%',
            image: 'https://via.placeholder.com/350x200',
            notes: 'Right Knee skin tear of unknown origin'
        },
        {
            date: '03/05/2025',
            dateTime: '3/5/2025 10:26:30 AM',
            ref: 'ref #1890120',
            length: 'L: 1.95',
            width: 'W: 3.25',
            depth: 'D: 0.88',
            area: 'A: 1.95',
            volume: 'V: 3.25',
            volumeValue: '63.396',
            par: 'PAR: 17%',
            image: 'https://via.placeholder.com/350x200',
            notes: 'Right Knee skin tear of unknown origin - Reference'
        },
        {
            date: '02/25/2025',
            dateTime: '2/25/2025 10:26:30 AM',
            ref: 'ref #1991203',
            length: 'L: 1.95',
            width: 'W: 3.25',
            depth: 'D: 0.88',
            area: 'A: 1.95',
            volume: 'V: 3.25',
            volumeValue: '55.396',
            par: 'PAR: 17%',
            image: 'https://via.placeholder.com/350x200',
            notes: 'Right Knee skin tear of unknown origin'
        }
    ];
    
    // Function to show details in offcanvas
    function showDetailsInOffcanvas(index) {
        const data = detailsData[index];
        
        // Update offcanvas content
        document.getElementById('offcanvasDate').textContent = data.date;
        document.getElementById('offcanvasVolume').textContent = `Volume: ${data.volumeValue}`;
        document.getElementById('offcanvasImage').src = data.image;
        document.getElementById('offcanvasDateTime').textContent = data.dateTime;
        document.getElementById('offcanvasRef').textContent = data.ref;
        document.getElementById('offcanvasLength').textContent = data.length;
        document.getElementById('offcanvasWidth').textContent = data.width;
        document.getElementById('offcanvasDepth').textContent = data.depth;
        document.getElementById('offcanvasArea').textContent = data.area;
        document.getElementById('offcanvasVolumeDetail').textContent = data.volume;
        document.getElementById('offcanvasPar').textContent = data.par;
        document.getElementById('clinicalNotes').innerHTML = `<p>${data.notes}</p>`;
        
        // Show the offcanvas
        const offcanvasElement = document.getElementById('detailsOffcanvas');
        const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
        offcanvas.show();
        
        // Update chart to highlight the selected point
        woundChart.setActiveElements([{
            datasetIndex: 0,
            index: index
        }]);
        woundChart.update();
    }
    
    // Event listeners for list items
    const listItems = document.querySelectorAll('.list-group-item');
    listItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const index = parseInt(this.getAttribute('data-index'));
            showDetailsInOffcanvas(index);
            
            // Update chart to highlight the corresponding point
            const chartIndex = dates.findIndex(date => date === this.getAttribute('data-date'));
            if (chartIndex !== -1) {
                woundChart.setActiveElements([{
                    datasetIndex: 0,
                    index: chartIndex
                }]);
                woundChart.update();
            }
        });
    });
    
    
    // Event listener for Add Note button
    document.getElementById('addNoteBtn').addEventListener('click', function() {
        const newNote = prompt('Enter a new clinical note:');
        if (newNote) {
            const noteElement = document.createElement('p');
            noteElement.textContent = newNote;
            document.getElementById('clinicalNotes').appendChild(noteElement);
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    let currentDataIndex = 0; // Track current position

    // Wound measurement data - all data in one place
    const woundData = [
        {
            date: '2025-03-20',
            formattedDate: '26/03/2025',
            time: '11:26:30 AM',
            certNumber: '1901283',
            ref: 'ref #1919226',
            measurements: {
                length: 2.95,
                width: 1.25,
                depth: 0.08,
                area: 8.34,
                volume: 1.58,
                par: 17
            },
            graphValue: 7.0,
            volumeValue: '70.396',
            thumbnail: 'assets/images/problem1.png',
            images: ['assets/images/problem1.png'],
            notes: 'Right Knee skin tear of unknown origin',
            isReference: false
        },
        {
            date: '2025-03-05',
            formattedDate: '27/05/2025',
            time: '12:26:45 AM',
            certNumber: '1890120',
            ref: 'ref #10081927',
            measurements: {
                length: 5.95,
                width: 1.25,
                depth: 2.88,
                area: 8.34,
                volume: 1.58,
                par: 15
            },
            graphValue: 6.0,
            volumeValue: '63.396',
            thumbnail: 'assets/images/problem2.png',
            images: ['assets/images/problem2.png'],
            notes: 'Right Knee skin tear of unknown origin',
            isReference: true
        },
        {
            date: '2025-02-25',
            formattedDate: '28/05/2025',
            time: '01:20:34 AM',
            certNumber: '1991203',
            ref: 'ref #1991228',
            measurements: {
                length: 1.95,
                width: 4.25,
                depth: 2.88,
                area: 1.34,
                volume: 3.58,
                par: 20
            },
            graphValue: 5.5,
            volumeValue: '55.396',
            thumbnail: 'assets/images/problem3.png',
            images: ['assets/images/problem3.png'],
            notes: 'Right Knee skin tear of unknown origin',
            isReference: false
        }
    ].sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

    // Function to create list item HTML
    function createListItemHTML(data, index) {
        return `
            <a href="#" class="list-group-item list-group-item-action d-flex justify-content-start align-items-center border-0 rounded-0" 
               data-date="${data.date}" data-index="${index}">
                <div>
                    <img src="${data.thumbnail}" class="img-fluid rounded-1" style="width: 110px;">
                </div>
                <div class="px-3">
                    <strong>${data.formattedDate}${data.isReference ? ' <span class="badge text-bg-danger">Reference</span>' : ''}</strong>
                    <br>
                    <strong>L: </strong><small>${data.measurements.length}</small> 
                    <strong>W: </strong><small>${data.measurements.width}</small> 
                    <strong>D: </strong><small>${data.measurements.depth}</small>
                    <br>
                    <small>Cert #:</small><small> ${data.certNumber}</small>
                </div>
            </a>
        `;
    }

    // Function to populate list items in all tabs
    function populateListItems() {
        const tabPanes = ['chart', 'healing', 'table', 'stats'];
        tabPanes.forEach(tabId => {
            const listGroup = document.querySelector(`#${tabId} .list-group`);
            if (listGroup) {
                listGroup.innerHTML = woundData.map((data, index) => createListItemHTML(data, index)).join('');
            }
        });
    }
    
    // Chart configuration
    const ctx = document.getElementById('woundChart').getContext('2d');
    const woundChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: woundData.map(data => data.formattedDate),
            datasets: [{
                label: 'Wound Measurement',
                data: woundData.map(data => data.graphValue),
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
                    enabled: true,
                    mode: 'nearest',
                    intersect: false,
                    position: 'nearest',
                    callbacks: {
                        title: function(context) {
                            const data = woundData[context[0].dataIndex];
                            return data.formattedDate;
                        },
                        label: function(context) {
                            const data = woundData[context.dataIndex];
                            return [
                                `Area: ${data.measurements.area} cm²`,
                                `L: ${data.measurements.length} W: ${data.measurements.width} D: ${data.measurements.depth}`
                            ];
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
            },
            onHover: (e) => {
                const points = woundChart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
                document.body.style.cursor = points.length ? 'pointer' : 'default';
            }
        }
    });

    // Function to show tooltip programmatically
    function showChartTooltip(index) {
        const chart = woundChart;
        const datasetIndex = 0;
        
        // Clear any existing tooltips
        chart.tooltip.setActiveElements([], { x: 0, y: 0 });
        
        // Get the point coordinates
        const meta = chart.getDatasetMeta(datasetIndex);
        const point = meta.data[index];

        // Show tooltip at point position
        chart.tooltip.setActiveElements([
            { datasetIndex: datasetIndex, index: index }
        ], {
            x: point.x,
            y: point.y
        });

        chart.update('none'); // Update without animation
    }
    
    // Data for the offcanvas details - now with additional images for carousel
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
            graphValue: 7.0,
            images: ['assets/images/problem1.png', 'assets/images/problem2.png', 'assets/images/problem3.png'],
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
            graphValue: 6.0,
            images: ['assets/images/problem1.png', 'assets/images/problem2.png', 'assets/images/problem3.png'],
            notes: 'Right Knee skin tear of unknown origin'
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
            graphValue: 5.5,
            images: ['assets/images/problem1.png', 'assets/images/problem2.png', 'assets/images/problem3.png'],
            notes: 'Right Knee skin tear of unknown origin'
        }
    ].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)); // Sort by date, newest first
    
    // Function to update all UI elements based on current data index
    function updateUIForIndex(index) {
        currentDataIndex = index;
        const data = detailsData[index];

        // Update chart tooltip and highlighting
        woundChart.setActiveElements([{
            datasetIndex: 0,
            index: detailsData.length - 1 - index
        }]);
        showChartTooltip(detailsData.length - 1 - index);
        
        // Update offcanvas content
        document.getElementById('offcanvasDate').textContent = data.date;
        document.getElementById('offcanvasVolume').textContent = `Volume: ${data.volumeValue}`;
        document.getElementById('offcanvasDateTime').innerHTML = `<strong>${data.date}</strong> ${data.dateTime.split(' ')[1]}`;
        document.getElementById('offcanvasRef').textContent = data.ref;
        document.getElementById('offcanvasLength').textContent = data.length;
        document.getElementById('offcanvasWidth').textContent = data.width;
        document.getElementById('offcanvasDepth').textContent = data.depth;
        document.getElementById('offcanvasArea').textContent = data.area;
        document.getElementById('offcanvasVolumeDetail').textContent = data.volume;
        document.getElementById('offcanvasPar').textContent = data.par;
        document.getElementById('clinicalNotes').innerHTML = `<p>${data.notes}</p>`;
        
        // Update carousel images
        updateCarouselImages(data.images);
        
        // Update chart highlighting
        woundChart.setActiveElements([{
            datasetIndex: 0,
            index: detailsData.length - 1 - index // Reverse index since data is newest first
        }]);
        woundChart.update();
        
        // Update list item highlighting
        const allListItems = document.querySelectorAll('.list-group-item');
        allListItems.forEach(item => item.classList.remove('active'));
        allListItems[index]?.classList.add('active');
    }

    // Function to move carousel and update data
    function moveCarousel(direction) {
        let newIndex;
        if (direction === 'next') {
            newIndex = currentDataIndex + 1 >= detailsData.length ? 0 : currentDataIndex + 1;
        } else {
            newIndex = currentDataIndex - 1 < 0 ? detailsData.length - 1 : currentDataIndex - 1;
        }
        updateUIForIndex(newIndex);
    }

    // Function to update carousel images and controls
    function updateCarouselImages(data) {
        const carouselInner = document.querySelector('#customCarousel .carousel-inner');
        carouselInner.innerHTML = '';
        
        data.images.forEach((image, index) => {
            const div = document.createElement('div');
            div.className = `carousel-item${index === 0 ? ' active' : ''}`;
            div.innerHTML = `<img src="${image}" alt="Slide ${index + 1}" class="img-fluid">`;
            carouselInner.appendChild(div);
        });

        // Add navigation info to carousel
        const navInfo = document.createElement('div');
        navInfo.className = 'carousel-navigation-info position-absolute bottom-0 start-50 translate-middle-x bg-dark bg-opacity-75 text-white px-3 py-1 rounded-top';
        navInfo.style.fontSize = '0.8rem';
        navInfo.innerHTML = `Record ${currentDataIndex + 1} of ${woundData.length}`;
        carouselInner.appendChild(navInfo);
    }

    // Function to show details in offcanvas
    function showDetailsInOffcanvas(index) {
        currentDataIndex = index;
        const data = woundData[index];
        
        // Update offcanvas content
        document.getElementById('offcanvasDate').textContent = data.formattedDate;
        document.getElementById('offcanvasVolume').textContent = `Volume: ${data.volumeValue}`;
        document.getElementById('offcanvasDateTime').innerHTML = `<strong>${data.formattedDate}</strong> ${data.time}`;
        document.getElementById('offcanvasRef').textContent = data.ref;
        document.getElementById('offcanvasLength').textContent = `L: ${data.measurements.length}`;
        document.getElementById('offcanvasWidth').textContent = `W: ${data.measurements.width}`;
        document.getElementById('offcanvasDepth').textContent = `D: ${data.measurements.depth}`;
        document.getElementById('offcanvasArea').textContent = `A: ${data.measurements.area}`;
        document.getElementById('offcanvasVolumeDetail').textContent = `V: ${data.measurements.volume}`;
        document.getElementById('offcanvasPar').textContent = `PAR: ${data.measurements.par}%`;
        document.getElementById('clinicalNotes').innerHTML = `<p>${data.notes}</p>`;
        
        // Update carousel
        updateCarouselImages(data);
        
        // Show the offcanvas without backdrop
        const offcanvasElement = document.getElementById('detailsOffcanvas');
        const offcanvas = new bootstrap.Offcanvas(offcanvasElement, {
            backdrop: false
        });
        offcanvas.show();
        
        // Ensure offcanvas has a semi-transparent background
        offcanvasElement.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        
        // Update chart highlighting and show tooltip
        woundChart.setActiveElements([{
            datasetIndex: 0,
            index: index
        }]);
        showChartTooltip(index);
        
        // Highlight current list item in all tabs
        document.querySelectorAll('.list-group-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-index') === index.toString()) {
                item.classList.add('active');
            }
        });

        // Scroll the active list item into view in all tabs
        document.querySelectorAll('.list-group-item.active').forEach(item => {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // Navigate through records
    function navigateRecords(direction) {
        const newIndex = direction === 'next' 
            ? (currentDataIndex + 1 >= woundData.length ? 0 : currentDataIndex + 1)
            : (currentDataIndex - 1 < 0 ? woundData.length - 1 : currentDataIndex - 1);
            
        // Show offcanvas and update chart
        showDetailsInOffcanvas(newIndex);
        
        // Ensure tooltip is shown
        setTimeout(() => {
            showChartTooltip(newIndex);
        }, 100); // Small delay to ensure chart is updated
    }

    // Initialize carousel controls with data navigation
    document.querySelector('.carousel-control-prev').addEventListener('click', function(e) {
        e.preventDefault();
        navigateRecords('prev');
    });
    
    document.querySelector('.carousel-control-next').addEventListener('click', function(e) {
        e.preventDefault();
        navigateRecords('next');
    });

    // Initialize list items and event listeners
    populateListItems();

    // Event listeners for list items - now handling all tabs
    const tabPanes = ['chart', 'healing', 'table', 'stats'];
    tabPanes.forEach(tabId => {
        const listItems = document.querySelectorAll(`#${tabId} .list-group-item`);
        listItems.forEach((item) => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const itemIndex = parseInt(this.getAttribute('data-index'));
                showDetailsInOffcanvas(itemIndex);
            });
        });
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!document.getElementById('detailsOffcanvas').classList.contains('show')) return;
        
        if (e.key === 'ArrowLeft') {
            navigateRecords('prev');
        } else if (e.key === 'ArrowRight') {
            navigateRecords('next');
        }
    });

    // Add touch swipe support for carousel
    let touchStartX = 0;
    let touchEndX = 0;
    
    const carousel = document.querySelector('#customCarousel');
    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX) {
            navigateRecords('next');
        } else if (touchEndX > touchStartX) {
            navigateRecords('prev');
        }
    }, false);
});



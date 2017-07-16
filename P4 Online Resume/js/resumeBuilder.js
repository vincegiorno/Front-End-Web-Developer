/*
This is empty on purpose! Your code to build the resume will go here.
 */

$('#main').append(internationalizeButton);

function inName(oldName) {
    names = oldName.split(' ');
    names[1] = names[1].toUpperCase();
    names[0] = names[0].slice(0, 1).toUpperCase() + names[0].slice(1).toLowerCase();
    return names.join(' ');
}

$('#mapDiv').append(googleMap);

var bio = {
    'name': 'Homer Simpson',
    'role': 'Web Developer',
    'contacts': {
        'mobile': '666666',
        'email': 'simpson@JS.com',
        'github': 'simpsonJS',
        'twitter': '@simpson',
        'location': 'Beijing'
    },
    'welcomeMessage': "Don't forget to be awesome!",
    'skills': ['programming', 'eating', 'sleeping'],
    'biopic': 'images/simpson.png',
    'display': function () {
        var formattedName = HTMLheaderName.replace('%data%', bio.name);
        var formattedRole = HTMLheaderRole.replace('%data%', bio.role);

        var formattedmobile = HTMLmobile.replace('%data%', bio.contacts.mobile);
        var formattedemail = HTMLemail.replace('%data%', bio.contacts.email);
        var formattedgithub = HTMLgithub.replace('%data%', bio.contacts.github);
        var formattedtwitter = HTMLtwitter.replace('%data%', bio.contacts.twitter);
        var formattedlocation = HTMLlocation.replace('%data%', bio.contacts.location);

        var formattedwelcomeMsg = HTMLwelcomeMsg.replace('%data%', bio.welcomeMessage);
        var formattedbioPic = HTMLbioPic.replace('%data%', bio.biopic);

        $('#header').prepend(formattedRole).prepend(formattedName).append(formattedbioPic).append(formattedwelcomeMsg);

        $('#topContacts').append(formattedmobile).append(formattedemail).append(formattedgithub).append(formattedtwitter)
            .append(formattedlocation);

        $('#footerContacts').append(formattedmobile).append(formattedemail).append(formattedgithub).append(formattedtwitter)
            .append(formattedlocation);

        $('#header').append(HTMLskillsStart);

        bio.skills.forEach(function(val){
            var formattedskills = HTMLskills.replace('%data%',val);
            $('#header').append(formattedskills);
        });
    }
};

bio.display();

var work = {
    'jobs': [
        {
            'employer': 'Baidu',
            'title': 'Front-end Engineer',
            'location': 'Beijing',
            'dates': 'Past - January 3000',
            'description': "In most episodes, he works as the Nuclear Safety Inspector at the Springfield Nuclear Power Plant, " +
            "a position he has held since 'Homer's Odyssey', the third episode of the series. At the plant, Homer is often " +
            "ignored and completely forgotten by his boss Mr. Burns, and constantly falls asleep and neglects his duties."
        },
        {
            'employer': 'Alibaba',
            'title': 'Back-end Engineer',
            'location': 'Shenzhen',
            'dates': 'January 3000 - Future',
            'description': "In most episodes, he works as the Nuclear Safety Inspector at the Springfield Nuclear Power Plant, " +
            "a position he has held since 'Homer's Odyssey', the third episode of the series. At the plant, Homer is often " +
            "ignored and completely forgotten by his boss Mr. Burns, and constantly falls asleep and neglects his duties."
        }
    ],
    'display': function () {
        work.jobs.forEach(function(job){
            $('#workExperience').append(HTMLworkStart);
            var formattedemployer = HTMLworkEmployer.replace('%data%', job.employer);
            var formattedtitle = HTMLworkTitle.replace('%data%', job.title);
            $('.work-entry:last').append(formattedemployer + formattedtitle);
            var formatteddates = HTMLworkDates.replace('%data%', job.dates);
            $('.work-entry:last').append(formatteddates);
            var formattedlocation = HTMLworkLocation.replace('%data%', job.location);
            $('.work-entry:last').append(formattedlocation);
            var formatteddescription = HTMLworkDescription.replace('%data%', job.description);
            $('.work-entry:last').append(formatteddescription);
        });
    }
};

work.display();

var projects = {
    'projects': [{
        'title': 'Sample Project',
        'dates': '2018',
        'description': "After Homer accidentally pollutes the town's water supply, Springfield is encased in a gigantic dome by the EPA and the Simpson family are declared fugitives.",
        'images': ['images/project.jpg']
    }],
    'display': function () {
        projects.projects.forEach(function(project){
            $('#projects').append(HTMLprojectStart);
            var formattedtitle = HTMLprojectTitle.replace('%data%', project.title);
            $('.project-entry:last').append(formattedtitle);
            var formatteddates = HTMLprojectDates.replace('%data%', project.dates);
            $('.project-entry:last').append(formatteddates);
            var formatteddescription = HTMLprojectDescription.replace('%data%', project.description);
            $('.project-entry:last').append(formatteddescription);
            project.images.forEach(function(image){
                var formattedimages = HTMLprojectImage.replace('%data%', image);
                $('.project-entry:last').append(formattedimages);
            });
        });
    }
};

projects.display();

var education = {
    'schools': [
        {
            'name': 'Shanghai Jiaotong University',
            'location': 'Shanghai',
            'degree': 'Masters',
            'majors': ['CS'],
            'dates': '2010',
            'url': ''
        },
        {
            'name': 'Jilin University',
            'location': 'Changchun',
            'degree': 'BA',
            'majors': ['CS'],
            'dates': '2014',
            'url': ''
        }
    ],
    'onlineCourses': [{
        'title': 'JavaScript Crash Course',
        'school': 'Udacity',
        'dates': "2015",
        'url': 'https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001'
    }],
    'display': function () {
        education.schools.forEach(function(school){
            $('#education').append(HTMLschoolStart);
            var formattedname = HTMLschoolName.replace('%data%', school.name);
            var formatteddegree = HTMLschoolDegree.replace('%data%', school.degree);
            $('.education-entry:last').append(formattedname + formatteddegree);
            var formattedschooldates = HTMLschoolDates.replace('%data%', school.dates);
            $('.education-entry:last').append(formattedschooldates);
            var formattedlocation = HTMLschoolLocation.replace('%data%', school.location);
            $('.education-entry:last').append(formattedlocation);
            school.majors.forEach(function (major) {
                var formattedmajors = HTMLschoolMajor.replace('%data%', major);
                $('.education-entry:last').append(formattedmajors);
            });
        });
        education.onlineCourses.forEach(function (onlineCourse) {
            $('#education').append(HTMLonlineClasses);
            $('#education').append(HTMLschoolStart);
            var formattedtitle = HTMLonlineTitle.replace('%data%', onlineCourse.title);
            var formattedschool = HTMLonlineSchool.replace('%data%', onlineCourse.school);
            $('.education-entry:last').append(formattedtitle + formattedschool);
            var formattedonlinedates = HTMLonlineDates.replace('%data%', onlineCourse.dates);
            $('.education-entry:last').append(formattedonlinedates);
            var formattedurl = HTMLonlineURL.replace('%data%', onlineCourse.url);
            $('.education-entry:last').append(formattedurl);
        });
    }
};

education.display();

#!/usr/bin/perl -w
# Note: above -w flag should be removed in production, as it will cause warnings in
# 3rd party modules to appear in the server error log

use utf8;
use v5.12;
use lib qw(/var/www/webperl);
use FindBin;

our ($scriptpath, $fallbackpath, $contact);

# Handle very early startup tasks
BEGIN {
    # Modify these two defaults to suit your environment
    $fallbackpath = "/path/to/bigscreen";
    $contact      = 'chris@starforge.co.uk';

    # Location autodetect will fail under mod_perl, so use a hard-coded location.
    if($ENV{MOD_PERL}) {
        $scriptpath = $fallbackpath;
    # Otherwise use the script's location as the script path
    } elsif($FindBin::Bin =~ /(.*)/) {
        $scriptpath = $1;
    }
}

use lib "$scriptpath/modules";

# Catch as many fatals as possible and send them to the user as well as stderr
use CGI::Carp qw(fatalsToBrowser set_message);

# Webperl modules
use Webperl::Application;

# Webapp modules
use BigScreen::AppUser;
use BigScreen::BlockSelector;
use BigScreen::System;

delete @ENV{qw(PATH IFS CDPATH ENV BASH_ENV)}; # Clean up ENV

# install more useful error handling
sub handle_errors {
    my $msg = shift;
    print "<h1>Software error</h1>\n";
    print '<p>Server time: ',scalar(localtime()),'<br/>Error was:</p><pre>',$msg,'</pre>';
    print '<p>Please report this error to ',$contact,' giving the text of this error and the time and date at which it occured</p>';
}
set_message(\&handle_errors);

do {
    my $app = Webperl::Application -> new(appuser        => BigScreen::AppUser -> new(),
                                          system         => BigScreen::System -> new(),
                                          block_selector => BigScreen::BlockSelector -> new())
        or die "Unable to create application";
    $app -> run();
}

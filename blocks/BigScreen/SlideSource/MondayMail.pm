# @file
# This file contains the implementation of the Monday Mail class
#
# @author  Chris Page &lt;chris@starforge.co.uk&gt;
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

## @class
package BigScreen::SlideSource::MondayMail;

use strict;
use experimental 'smartmatch';
use base qw(BigScreen::SlideSource);
use v5.12;

sub generate_slides {
    my $self = shift;

    my $xml = eval { XML::LibXML -> load_xml(location => $self -> {"feed_url"}); };

    print Dumper($xml);
}


1;
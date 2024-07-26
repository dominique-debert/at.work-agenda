package agiir.agenda.portlet;

import com.liferay.portal.kernel.util.PortalUtil;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentException;

public class Activator implements BundleActivator {

	private boolean activable = true; 

	@Override
	public void start(BundleContext context) throws Exception {
		
		System.out.println("Start agenda bundle");
		
		Properties properties = PortalUtil.getPortalProperties();
		String serverHome = properties.getProperty("liferay.home");
		System.out.println(serverHome);
		
		Path p = Paths.get(serverHome+"/agiir-agenda-manager-startup");
		boolean exists = Files.exists(p);
		boolean notExists = Files.notExists(p);

		if (exists) {
		    System.out.println("File exists!");
		    activable = true;
		} else if (notExists) {
		    System.out.println("File doesn't exist!");
		    activable = false;
		} else {
		    System.out.println("File's status is unknown!");
		}
				
		System.out.println(activable);
		if(activable == true) {
			throw new ComponentException("Bundleagiir-agenda not yet activable");
		}

	}

	@Override
	public void stop(BundleContext context) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("Stop agenda bundle");
	}
	
}
